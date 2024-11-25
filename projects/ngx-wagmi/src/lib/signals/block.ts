import { computed } from '@angular/core';

import type { BlockTag } from 'viem';

import { injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import type { Config, GetBlockErrorType, ResolvedRegister } from '@wagmi/core';
import type { Compute, UnionCompute, UnionStrictOmit } from '@wagmi/core/internal';
import {
  type GetBlockData,
  type GetBlockOptions,
  type GetBlockQueryFnData,
  type GetBlockQueryKey,
  getBlockQueryOptions,
} from '@wagmi/core/query';

import type { QueryParameter } from '../types/properties';
import { emptyObjFn, type InjectQueryReturnType } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';
import { injectWatchBlocks, type InjectWatchBlocksParameters } from './watchBlocks';

export type InjectBlockParameters<
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = 'latest',
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetBlockData<includeTransactions, blockTag, config, chainId>,
> = Compute<
  GetBlockOptions<includeTransactions, blockTag, config, chainId> &
    QueryParameter<
      GetBlockQueryFnData<includeTransactions, blockTag, config, chainId>,
      GetBlockErrorType,
      selectData,
      GetBlockQueryKey<includeTransactions, blockTag, config, chainId>
    > & {
      watch?:
        | boolean
        | UnionCompute<
            UnionStrictOmit<
              InjectWatchBlocksParameters<includeTransactions, blockTag, config, chainId>,
              'chainId' | 'onBlock' | 'onError'
            >
          >
        | undefined;
    }
>;

export type InjectBlockReturnType<
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = 'latest',
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetBlockData<includeTransactions, blockTag, config, chainId>,
> = InjectQueryReturnType<selectData, GetBlockErrorType>;

export function injectBlock<
  includeTransactions extends boolean = false,
  blockTag extends BlockTag = 'latest',
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetBlockData<includeTransactions, blockTag, config, chainId>,
>(
  parametersFn: () => InjectBlockParameters<includeTransactions, blockTag, config, chainId, selectData> = emptyObjFn,
): InjectBlockReturnType<includeTransactions, blockTag, config, chainId, selectData> {
  const config = injectConfig();
  const queryClient = injectQueryClient();
  const configChainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { query = {} } = parameters;
    const chainId = parameters.chainId ?? configChainId();

    const options = getBlockQueryOptions(config, {
      ...parameters,
      chainId,
    });
    const enabled = Boolean(query.enabled ?? true);
    return {
      ...query,
      ...options,
      enabled,
    };
  });

  injectWatchBlocks(() => {
    const { watch, chainId: _chainId } = parametersFn();
    const chainId = _chainId ?? configChainId();
    const { enabled, queryKey } = props();

    return {
      ...({
        chainId,
        ...(typeof watch === 'object' ? watch : {}),
      } as InjectWatchBlocksParameters),
      enabled: Boolean(enabled && (typeof watch === 'object' ? watch.enabled : watch)),
      onBlock(block) {
        queryClient.setQueryData(queryKey, block);
      },
    };
  });

  return injectQuery(props) as InjectBlockReturnType<includeTransactions, blockTag, config, chainId, selectData>;
}
