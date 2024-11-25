import { effect } from '@angular/core';

import {
  type Config,
  type ResolvedRegister,
  watchBlockNumber,
  type WatchBlockNumberParameters,
} from '@wagmi/core';
import type {
  UnionCompute,
  UnionExactPartial,
} from '@wagmi/core/internal';

import type {
  ConfigParameter,
  EnabledParameter,
} from '../types/properties.js';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectWatchBlockNumberParameters<config extends Config = Config, chainId extends config['chains'][number]['id'] = config['chains'][number]['id']> = UnionCompute<
  UnionExactPartial<WatchBlockNumberParameters<config, chainId>> & ConfigParameter<config> & EnabledParameter
>;

export type InjectWatchBlockNumberReturnType = void;

export function injectWatchBlockNumber<config extends Config = ResolvedRegister['config'], chainId extends config['chains'][number]['id'] = config['chains'][number]['id']>(
  parameters: InjectWatchBlockNumberParameters<config, chainId> = {} as any
): InjectWatchBlockNumberReturnType {
  const { enabled = true, onBlockNumber, config: _, ...rest } = parameters;

  const config = injectConfig(parameters);
  const configChainId = injectChainId({ config });
  const chainId = parameters.chainId ?? configChainId;

  effect(() => {
    if (!enabled) return;
    if (!onBlockNumber) return;
    return watchBlockNumber(config, {
      ...(rest as any),
      chainId,
      onBlockNumber,
    });
  });
}
