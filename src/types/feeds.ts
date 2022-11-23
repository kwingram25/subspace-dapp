import { VoidFn } from './substrate';

export interface FeedReport {
  id: number;
  isActive: boolean;
  size: number;
  count: number;
}

export type OnPut = (_: number) => void;
export type OnCloseFeed = (_: number) => void;
export type OnTransferFeed = (_: number, __: string) => void;

export enum TxType {
  CreateFeed,
  PutObject,
  TransferFeed,
  CloseFeed,
}

export enum TxStatus {
  Processing,
  Success,
  Error,
}

export interface TxOptions {
  feedId?: number;
  onStart: VoidFn;
  onComplete: VoidFn;
  onSuccess?: VoidFn;
}

export interface Tx {
  feedId?: number;
  type: TxType;
  status: TxStatus;
}
