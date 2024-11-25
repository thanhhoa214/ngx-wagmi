import { effect, signal } from '@angular/core';

import { type Config, getChains, type GetChainsReturnType } from '@wagmi/core';
import { watchChains } from '@wagmi/core/internal';

import { injectConfig } from './config';

export type InjectChainsReturnType<config extends Config = Config> = GetChainsReturnType<config>;

export function injectChains() {
  const config = injectConfig();
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
