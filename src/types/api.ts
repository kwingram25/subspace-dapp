import { ApiPromise } from '@polkadot/api';

import type { KeyringAddress } from './substrate';

export type Endpoints = { name: string; url: string }[];

export type ApiAction =
  | { type: 'INIT'; payload?: string }
  | { type: 'CONNECTED'; payload: ApiPromise }
  | { type: 'READY'; payload: KeyringAddress[] }
  | { type: 'ERROR'; payload: string }
  | { type: 'LATEST'; payload: number };

export interface ApiState {
  api: ApiPromise;
  accounts: KeyringAddress[];
  error: string | null;
  isConnected: boolean;
  isReady: boolean;
  latestBlock: number;
}

export interface UseEndpoints {
  recentlyUsed: Endpoints;
  lastUsed: string;
  setLastUsed: React.Dispatch<React.SetStateAction<string>>;
  addEndpoint: (_: string, __: string) => void;
}
