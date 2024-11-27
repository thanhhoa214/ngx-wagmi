import type { Config, GetTransactionErrorType, ResolvedRegister } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import {
  type GetTransactionData,
  type GetTransactionOptions,
  type GetTransactionQueryFnData,
  type GetTransactionQueryKey,
  getTransactionQueryOptions,
} from '@wagmi/core/query';

import { computed } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import type { ConfigParameter, QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectTransactionParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetTransactionData<config, chainId>,
> = Compute<
  GetTransactionOptions<config, chainId> &
    ConfigParameter<config> &
    QueryParameter<
      GetTransactionQueryFnData<config, chainId>,
      GetTransactionErrorType,
      selectData,
      GetTransactionQueryKey<config, chainId>
    >
>;

export type InjectTransactionReturnType<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetTransactionData<config, chainId>,
> = InjectQueryReturnType<selectData, GetTransactionErrorType>;

/** https://wagmi.sh/react/api/hooks/useTransaction */
export function injectTransaction<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetTransactionData<config, chainId>,
>(
  parametersFn: () => InjectTransactionParameters<config, chainId, selectData> = emptyObjFn,
): InjectTransactionReturnType<config, chainId, selectData> {
  const config = injectConfig();
  const configChainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { blockHash, blockNumber, blockTag, hash, query = {} } = parameters;
    const chainId = parameters.chainId ?? configChainId();
    const options = getTransactionQueryOptions(config, {
      ...parameters,
      chainId,
    });
    const enabled = Boolean(!(blockHash && blockNumber && blockTag && hash) && (query.enabled ?? true));
    return {
      ...(query as any),
      ...options,
      enabled,
    };
  });

  return injectQuery(props) as unknown as InjectTransactionReturnType<config, chainId, selectData>;
}
