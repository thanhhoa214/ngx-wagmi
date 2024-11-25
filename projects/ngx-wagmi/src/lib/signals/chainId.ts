import {
  effect,
  signal,
  Signal,
} from '@angular/core';

import {
  type Config,
  getChainId,
  type GetChainIdReturnType,
  type ResolvedRegister,
  watchChainId,
} from '@wagmi/core';

import type { ConfigParameter } from '../types/properties.js';
import { injectConfig } from './config';

export type InjectChainIdParameters<config extends Config = Config> =
  ConfigParameter<config>;

export type InjectChainIdReturnType<config extends Config = Config> =
  GetChainIdReturnType<config>;

export function injectChainId<
  config extends Config = ResolvedRegister['config']
>(
  parameters: InjectChainIdParameters<config> = {}
): Signal<InjectChainIdReturnType<config>> {
  const config = injectConfig(parameters);
  const chainId = signal(getChainId(config));

  effect((onClean) =>
    onClean(
      watchChainId(config, {
        onChange: (newId) => chainId.set(newId),
      })
    )
  );

  return chainId.asReadonly();
}
