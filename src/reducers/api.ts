import type { Reducer } from 'react';

import type { ApiAction, ApiState } from '../types';

export const INIT_STATE = {
  api: null,
  chainProperties: null,
  error: null,
  isConnected: false,
  isReady: false,
  latestBlock: 0,
} as unknown as ApiState;

export const reducer: Reducer<ApiState, ApiAction> = (state, action) => {
  switch (action.type) {
    case 'INIT':
      return {
        ...INIT_STATE,
        error: null,
      };

    case 'CONNECTED':
      return {
        ...state,
        api: action.payload,
        isConnected: true,
        error: null,
      };

    case 'READY':
      return {
        ...state,
        chainProperties: action.payload[0],
        accounts: action.payload[1],
        isReady: true,
        error: null,
      };

    case 'ERROR':
      return {
        ...state,
        error: action.payload || 'Unknown error',
        isReady: false,
      };

    case 'LATEST':
      return { ...state, latestBlock: action.payload };

    default:
      throw new Error(`Unknown action type`);
  }
};
