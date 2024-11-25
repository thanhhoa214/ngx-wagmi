import { effect } from '@angular/core';

import type { BlockTag } from 'viem';

import { type Config, type ResolvedRegister, watchBlocks, type WatchBlocksParameters } from '@wagmi/core';
import type { UnionCompute, UnionExactPartial } from '@wagmi/core/internal';

import type { ConfigParameter, EnabledParameter } from '../types/properties';
import { emptyObjFn } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectWatchBlocksParameters<
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = 'latest',
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
> = UnionCompute<
  UnionExactPartial<WatchBlocksParameters<includeTransactions, blockTag, config, chainId>> &
    ConfigParameter<config> &
    EnabledParameter
>;

export type InjectWatchBlocksReturnType = void;

export function injectWatchBlocks<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = 'latest',
>(
  parametersFn: () => InjectWatchBlocksParameters<includeTransactions, blockTag, config, chainId> = emptyObjFn as any,
): InjectWatchBlocksReturnType {
  const config = injectConfig(parametersFn());
  const configChainId = injectChainId({ config });

  effect((onClean) => {
    const parameters = parametersFn();
    const { enabled = true, onBlock, config: _, ...rest } = parameters;
    const chainId = parameters.chainId ?? configChainId();

    if (!enabled || !onBlock) return;
    return onClean(
      watchBlocks(config, {
        ...(rest as any),
        chainId,
        onBlock,
      }),
    );
  });
}
