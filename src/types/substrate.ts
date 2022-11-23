import type { Bool, Option, Struct, u64, Vec } from '@polkadot/types';

export type {
  AugmentedEvent,
  QueryableStorageMultiArg,
  Signer,
  SubmittableExtrinsic,
  VoidFn,
} from '@polkadot/api/types';
export type { KeyringPair } from '@polkadot/keyring/types';
export type { ChainType, Event, EventRecord } from '@polkadot/types/interfaces';
export type { AnyJson, Codec } from '@polkadot/types/types';
export type { KeyringAddress } from '@polkadot/ui-keyring/types';

export type FeedIds = Option<Vec<u64>>;

export interface Totals extends Struct {
  readonly size_: u64;
  readonly count: u64;
}

export interface FeedConfigs extends Struct {
  readonly active: Bool;
}
