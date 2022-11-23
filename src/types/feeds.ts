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

// export type ScanMode = 'live' | 'query';

// export type EventsAction =
//   | {
//       type: 'ADD';
//       payload: {
//         blockNumber: number;
//         newEvents: EventRecord[];
//         scanMode: ScanMode;
//         scanPercentage?: number;
//       };
//     }
//   | { type: 'FILTER_RANGE'; payload: { startBlock: number; endBlock: number } }
//   | { type: 'FILTER_NAMES'; payload: string[] }
//   | { type: 'FILTERED_COUNT'; payload: number }
//   | { type: 'CLEAR' }
//   | { type: 'RESET' }
//   | { type: 'SCAN_START' }
//   | { type: 'SCAN_COMPLETE' }
//   | { type: 'SCAN_MODE'; payload: 'live' | 'query' };

// export interface EventsState {
//   events: EventRow[];
//   filters: string[];
//   filteredCount: number;
//   blocks: number[];
//   methods: string[];
//   isFirstScanAttempt: boolean;
//   isScanning: boolean;
//   scanMode: ScanMode;
//   scanPercentage: number;
// }
