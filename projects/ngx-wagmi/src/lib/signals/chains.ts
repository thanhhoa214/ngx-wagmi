import { effect, signal } from '@angular/core';

import { type Config, getChains, type GetChainsReturnType, type ResolvedRegister } from '@wagmi/core';
import { watchChains } from '@wagmi/core/internal';

import type { ConfigParameter } from '../types/properties';
import { injectConfig } from './config';

export type InjectChainsParameters<config extends Config = Config> = ConfigParameter<config>;

export type InjectChainsReturnType<config extends Config = Config> = GetChainsReturnType<config>;

export function injectChains<config extends Config = ResolvedRegister['config']>(
  parameters: InjectChainsParameters<config> = {},
) {
  const config = injectConfig(parameters);
  const account = signal(getChains(config));

  effect((onClean) =>
    onClean(
      watchChains(config, {
        onChange: (newAccount) => account.set(newAccount),
      }),
    ),
  );

  return account.asReadonly();
}
