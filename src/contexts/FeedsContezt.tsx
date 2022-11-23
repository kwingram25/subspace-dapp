import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { web3FromAddress } from '@polkadot/extension-dapp';
import { Option } from '@polkadot/types';
import { keyring } from '@polkadot/ui-keyring';
import { isNull } from '@polkadot/util';

import { TxQueue } from '../components/TxQueue';
import {
  AugmentedEvent,
  EventRecord,
  FeedConfigs,
  FeedIds,
  FeedReport,
  KeyringPair,
  OnCloseFeed,
  OnPut,
  OnTransferFeed,
  QueryableStorageMultiArg,
  Signer,
  SubmittableExtrinsic,
  Totals,
  Tx,
  TxStatus,
  TxType,
} from '../types';
import { randomData } from '../util';

import { useApi } from './ApiContext';

interface Value {
  accountId: string;
  feedReports: FeedReport[];
  isFetching: boolean;
  maxSize: number;
  txQueue: Record<number, Tx>;
  onCreateFeed: () => void;
  onPut: OnPut;
  onCloseFeed: OnCloseFeed;
  onTransferFeed: OnTransferFeed;
  setAccountId: React.Dispatch<string>;
}

let txId = 0;

const FeedsContext = createContext<Value>({} as unknown as Value);

export function FeedsContextProvider({
  children,
}: React.PropsWithChildren<Partial<Value>>) {
  const { accounts, api, isReady } = useApi();

  // Track ongoing transactions and display status popups
  const [txQueue, setTxQueue] = useState<Record<number, Tx>>({});

  const [accountId, setAccountId] = useState(
    accounts && accounts[0] ? accounts[0].address : null
  );
  const [feedIds, setFeedIds] = useState<number[] | null>(null);
  const [feedReports, setFeedReports] = useState<FeedReport[]>([]);

  const maxSize = useMemo(
    () => Math.max(...feedReports.map(({ size }) => size)) || 1,
    [feedReports]
  );

  const isFetching = useMemo(
    () => isNull(feedIds) || (feedIds.length > 0 && feedReports.length === 0),
    [feedIds, feedReports.length]
  );

  // Retrieve feed ids owned by the current user
  const refreshFeeds = useCallback(
    (clearAll = false) => {
      if (clearAll) {
        setFeedIds(null);
        setFeedReports([]);
      }

      if (isReady && api) {
        api.query.feeds
          .feeds<FeedIds>(accountId)
          .then((res) => {
            if (!res || res.isEmpty) {
              setFeedIds([]);
            } else {
              setFeedIds(res.unwrap().map((s) => s.toNumber()));
            }
          })
          .catch(console.error);
      }
    },
    [api, accountId, isReady]
  );

  // Flow for provided chain transaction and success handling
  const createTxCallback = useCallback(
    (
        type: TxType,
        tx: () => SubmittableExtrinsic<'promise'> | undefined,
        successEvent: () => AugmentedEvent<'promise'> | undefined,
        feedId?: number
      ) =>
      async () => {
        if (!tx || !successEvent) {
          return;
        }

        let idOrPair: KeyringPair | string;
        let signer: Signer | undefined;

        if (keyring.getAccount(accountId).meta.isInjected) {
          idOrPair = accountId;
          signer = (await web3FromAddress(accountId)).signer;
        } else {
          idOrPair = keyring.getPair(accountId);
        }

        const thisTxId = ++txId;
        setTxQueue((txs) => ({
          ...txs,
          [thisTxId]: { feedId, type, status: TxStatus.Processing },
        }));

        let unsub: () => void;

        tx()
          .signAndSend(idOrPair, { signer }, (result) => {
            if (result.status.isInBlock) {
              // Check for success event
              const isComplete = result.events.find(({ event }: EventRecord) =>
                successEvent().is(event)
              );

              if (isComplete) {
                refreshFeeds();
                setTxQueue((txs) => ({
                  ...txs,
                  [thisTxId]: { ...txs[thisTxId], status: TxStatus.Success },
                }));
                unsub();
              }
            } else if (result.isError) {
              setTxQueue((txs) => ({
                ...txs,
                [thisTxId]: { ...txs[thisTxId], status: TxStatus.Error },
              }));
              unsub();
            }
          })
          .then((unsubLocal) => {
            unsub = unsubLocal;
          })
          .catch(() => {
            setTxQueue((txs) => ({
              ...txs,
              [thisTxId]: { ...txs[thisTxId], status: TxStatus.Error },
            }));
          });
      },
    [accountId, refreshFeeds]
  );

  const onCreateFeed = useCallback(() => {
    createTxCallback(
      TxType.CreateFeed,
      () => api.tx.feeds.create({ ContentAddressable: null }, null),
      () => api.events.feeds.FeedCreated
    )();
  }, [api, createTxCallback]);

  const onPut = useCallback(
    (feedId: number) => {
      const object = randomData();

      createTxCallback(
        TxType.PutObject,
        () => api.tx.feeds.put(feedId, object),
        () => api.events.feeds.ObjectSubmitted,
        feedId
      )();
    },
    [api, createTxCallback]
  );

  const onTransferFeed = useCallback(
    (feedId: number, newOwner: string) =>
      createTxCallback(
        TxType.TransferFeed,
        () => api.tx.feeds.transfer(feedId, newOwner),
        () => api.events.feeds.OwnershipTransferred,
        feedId
      )(),
    [api, createTxCallback]
  );

  const onCloseFeed = useCallback(
    (feedId: number) => {
      createTxCallback(
        TxType.CloseFeed,
        () => api.tx.feeds.close(feedId),
        () => api.events.feeds.FeedClosed,
        feedId
      )();
    },
    [api, createTxCallback]
  );

  // Set account once accounts are loaded
  useEffect(() => {
    if (!accountId && accounts && accounts[0] && isReady) {
      setAccountId(accounts[0].address);
    }
  }, [accountId, accounts, isReady]);

  // If account id was changed, clear old results
  useEffect(() => {
    refreshFeeds(true);
  }, [refreshFeeds]);

  // Detect new feed ids and fetch metadata from chain
  useEffect(() => {
    if (!api || !isReady) {
      return undefined;
    }
    let unsubscribe: () => void;

    async function loadAccountFeeds() {
      if ((feedIds || []).length === 0) {
        setFeedReports([]);
        return undefined;
      }

      return api.queryMulti(
        [
          ...feedIds.map((feedId) => [api.query.feeds.totals, feedId]),
          ...feedIds.map((feedId) => [api.query.feeds.feedConfigs, feedId]),
        ] as QueryableStorageMultiArg<'promise'>[],
        (resultsArray) => {
          const totals = resultsArray.slice(
            0,
            resultsArray.length / 2
          ) as unknown as Totals[];
          const configs = resultsArray.slice(
            resultsArray.length / 2
          ) as unknown as Option<FeedConfigs>[];

          setFeedReports(
            totals
              .map((total, i) => {
                const { size_: size, count } = total;

                return {
                  id: feedIds[i],
                  isActive: configs[i].isSome
                    ? configs[i].unwrap().active.isTrue
                    : true,
                  size: size.toNumber(),
                  count: count.toNumber(),
                };
              })
              .sort((a, b) => b.id - a.id)
          );
        }
      );
    }

    loadAccountFeeds()
      .then((unsubLocal) => {
        unsubscribe = unsubLocal;
        // setIsFetching(false);
      })
      .catch(console.error);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [api, isReady, feedIds]);

  // Auto-dismiss tx success or error messages
  useEffect(() => {
    let autoDismiss: NodeJS.Timeout;

    if (
      Object.values(txQueue).find(
        ({ status }) => status !== TxStatus.Processing
      )
    ) {
      autoDismiss = setTimeout(() => {
        setTxQueue((prev) =>
          Object.entries(prev).reduce((filtered, [id, tx]) => {
            if (tx.status !== TxStatus.Processing) {
              return filtered;
            }
            return {
              ...filtered,
              [id]: tx,
            };
          }, {})
        );
      }, 2000);
    }

    return () => clearTimeout(autoDismiss);
  }, [txQueue]);

  const value = useMemo(
    () => ({
      accountId,
      setAccountId,
      feedReports,
      isFetching,
      maxSize,
      txQueue,
      onCreateFeed,
      onCloseFeed,
      onTransferFeed,
      onPut,
    }),
    [
      accountId,
      setAccountId,
      feedReports,
      isFetching,
      maxSize,
      txQueue,
      onTransferFeed,
      onCreateFeed,
      onCloseFeed,
      onPut,
    ]
  );

  return (
    <FeedsContext.Provider value={value}>
      {children}
      <TxQueue />
    </FeedsContext.Provider>
  );
}

export const useFeeds = () => useContext(FeedsContext);
