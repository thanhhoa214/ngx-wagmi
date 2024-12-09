import {
  type Config,
  type GetClientParameters,
  type GetClientReturnType,
  type ResolvedRegister,
  getClient,
  watchClient,
} from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';

import { effect, signal } from '@angular/core';
import type { ConfigParameter } from '../types/properties';
import { emptyObjFn } from '../utils/query';
import { injectConfig } from './config';

export type InjectClientParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | number | undefined = config['chains'][number]['id'] | undefined,
> = Compute<GetClientParameters<config, chainId> & ConfigParameter<config>>;

export type InjectClientReturnType<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | number | undefined = config['chains'][number]['id'] | undefined,
> = GetClientReturnType<config, chainId>;

export function injectClient<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] | number | undefined = config['chains'][number]['id'] | undefined,
>(parametersFn: () => InjectClientParameters<config, chainId> = emptyObjFn) {
  const config = injectConfig();
  const client = signal(getClient(config, parametersFn()));
  effect((onClean) => onClean(watchClient(config, { onChange: client.set })), { allowSignalWrites: true });
  return client.asReadonly();
}
