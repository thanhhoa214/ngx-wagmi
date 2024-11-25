import { effect } from '@angular/core';
import { type Config, type ResolvedRegister, watchBlockNumber, type WatchBlockNumberParameters } from '@wagmi/core';
import type { UnionCompute, UnionExactPartial } from '@wagmi/core/internal';
import type { EnabledParameter } from '../types/properties.js';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectWatchBlockNumberParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
> = UnionCompute<UnionExactPartial<WatchBlockNumberParameters<config, chainId>> & EnabledParameter>;

export type InjectWatchBlockNumberReturnType = void;

export function injectWatchBlockNumber<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
>(parameters: InjectWatchBlockNumberParameters<config, chainId> = {} as any): InjectWatchBlockNumberReturnType {
  const config = injectConfig();
  const configChainId = injectChainId();

  const { enabled = true, onBlockNumber, ...rest } = parameters;
  const chainId = parameters.chainId ?? configChainId;

  effect((onClean) => {
    if (!enabled) return;
    if (!onBlockNumber) return;
    return onClean(
      watchBlockNumber(config, {
        ...(rest as any),
        chainId,
        onBlockNumber,
      }),
    );
  });
}
