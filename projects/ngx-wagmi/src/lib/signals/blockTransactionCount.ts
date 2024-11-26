import type { Config, GetBlockTransactionCountErrorType, ResolvedRegister } from '@wagmi/core';
import type { UnionCompute } from '@wagmi/core/internal';
import {
  type GetBlockTransactionCountData,
  type GetBlockTransactionCountOptions,
  type GetBlockTransactionCountQueryFnData,
  type GetBlockTransactionCountQueryKey,
  getBlockTransactionCountQueryOptions,
} from '@wagmi/core/query';

import { computed } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import type { QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn, queryOptionsSupportBigInt } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectBlockTransactionCountParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetBlockTransactionCountData,
> = UnionCompute<
  GetBlockTransactionCountOptions<config, chainId> &
    QueryParameter<
      GetBlockTransactionCountQueryFnData,
      GetBlockTransactionCountErrorType,
      selectData,
      GetBlockTransactionCountQueryKey<config, chainId>
    >
>;

export type InjectBlockTransactionCountReturnType<selectData = GetBlockTransactionCountData> = InjectQueryReturnType<
  selectData,
  GetBlockTransactionCountErrorType
>;

export function injectBlockTransactionCount<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetBlockTransactionCountData,
>(parametersFn: () => InjectBlockTransactionCountParameters<config, chainId, selectData> = emptyObjFn) {
  const config = injectConfig();
  const configChainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { query = {} } = parameters;
    const chainId = parameters.chainId ?? configChainId();
    const options = getBlockTransactionCountQueryOptions(config, {
      ...parameters,
      chainId,
    });

    return {
      ...queryOptionsSupportBigInt,
      ...query,
      ...options,
    };
  });

  return injectQuery(props) as InjectBlockTransactionCountReturnType<selectData>;
}
