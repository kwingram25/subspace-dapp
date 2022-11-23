import { u8aToHex } from '@polkadot/util';

const MAXIMUM_BYTES = 2000000;

export function randomData(): string {
  return u8aToHex(
    Uint8Array.from({ length: Math.floor(MAXIMUM_BYTES * Math.random()) }, () =>
      Math.floor(Math.random() * 255)
    )
  );
}
