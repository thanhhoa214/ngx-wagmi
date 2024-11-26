import { effect, signal } from '@angular/core';
import {
  type Config,
  type GetPublicClientParameters,
  type GetPublicClientReturnType,
  type ResolvedRegister,
  getPublicClient,
  watchPublicClient,
} from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import type { ConfigParameter } from '../types/properties';
import { emptyObjFn } from '../utils/query';
import { injectConfig } from './config';

export type InjectPublicClientParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | number | undefined = config['chains'][number]['id'] | undefined,
> = Compute<GetPublicClientParameters<config, chainId> & ConfigParameter<config>>;

export type InjectPublicClientReturnType<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | number | undefined = config['chains'][number]['id'] | undefined,
> = GetPublicClientReturnType<config, chainId>;

export function injectPublicClient<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] | number | undefined = config['chains'][number]['id'] | undefined,
>(parametersFn: () => InjectPublicClientParameters<config, chainId> = emptyObjFn) {
  const config = injectConfig();
  const publicClient = signal(getPublicClient(config, parametersFn()));
  effect((onClean) => onClean(watchPublicClient(config, { ...parametersFn(), onChange: publicClient.set })));
  return publicClient.asReadonly();
}
