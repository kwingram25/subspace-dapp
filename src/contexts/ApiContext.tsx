import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import { ApiPromise, WsProvider } from '@polkadot/api';
import {
  web3Accounts,
  web3Enable,
  web3EnablePromise,
} from '@polkadot/extension-dapp';
import { keyring } from '@polkadot/ui-keyring';

import { WS_RPC_URL } from '../constants';
import { INIT_STATE, reducer } from '../reducers/api';
import type { ApiState as Value, VoidFn } from '../types';

let _api: ApiPromise;

const ApiContext = createContext<Value>({} as unknown as Value);

function isKeyringLoaded() {
  try {
    return !!keyring.keyring;
  } catch {
    return false;
  }
}

export function ApiContextProvider({
  children,
}: React.PropsWithChildren<Partial<Value>>) {
  const [state, dispatch] = useReducer(reducer, {
    ...INIT_STATE,
  });

  useEffect(() => {
    try {
      if (_api) {
        _api.disconnect();
      }

      const provider = new WsProvider(WS_RPC_URL);
      _api = new ApiPromise({ provider });

      _api.on('connected', async () => {
        dispatch({ type: 'CONNECTED', payload: _api });
        // `ready` event is not emitted upon reconnection and is checked explicitly here.
        await _api.isReady;

        if (!web3EnablePromise) await web3Enable('contracts-ui');
        const injectedAccounts = await web3Accounts();

        if (!isKeyringLoaded()) {
          keyring.loadAll(
            { isDevelopment: true, ss58Format: 2254 },
            injectedAccounts
          );
        }

        dispatch({
          type: 'READY',
          payload: keyring.getAccounts(),
        });
      });

      _api.on('error', (e) => {
        dispatch({ type: 'ERROR', payload: (e as Error).message });
      });
    } catch (e) {
      dispatch({ type: 'ERROR', payload: (e as Error).message });
    }
  }, []);

  useEffect(() => {
    let unsub: VoidFn | undefined;

    async function subscribe() {
      unsub = await state.api?.rpc.chain.subscribeNewHeads((lastHeader) => {
        dispatch({ type: 'LATEST', payload: lastHeader.number.toNumber() });
      });
    }

    if (state.isReady) {
      subscribe();
    }

    return () => {
      if (unsub) unsub();
    };
  }, [state.api?.rpc.chain, state.isReady]);

  const value = useMemo(
    () => ({
      accounts: state.accounts,
      api: state.api,
      error: state.error,
      isConnected: state.isConnected,
      isReady: state.isReady,
      latestBlock: state.latestBlock,
    }),
    [
      state.accounts,
      state.api,
      state.error,
      state.isConnected,
      state.isReady,
      state.latestBlock,
    ]
  );

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export const useApi = () => useContext(ApiContext);
