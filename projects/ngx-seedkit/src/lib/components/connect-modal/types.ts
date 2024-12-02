import type { WalletDetailsParams } from '@rainbow-me/rainbowkit';
import type { Connector } from '@wagmi/core';

export type RkConnector<T extends boolean = false> = T extends true
  ? Connector & WalletDetailsParams
  : Connector & Partial<WalletDetailsParams>;
