import { computed } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import type { Config, GetTransactionCountErrorType, ResolvedRegister } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import type { GetTransactionCountQueryFnData } from '@wagmi/core/query';
import {
  type GetTransactionCountData,
  type GetTransactionCountOptions,
  type GetTransactionCountQueryKey,
  getTransactionCountQueryOptions,
} from '@wagmi/core/query';
import type { ConfigParameter, QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn, queryOptionsSupportBigInt } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectTransactionCountParameters<
  config extends Config = Config,
  selectData = GetTransactionCountData,
> = Compute<
  GetTransactionCountOptions<config> &
    ConfigParameter<config> &
    QueryParameter<
      GetTransactionCountQueryFnData,
      GetTransactionCountErrorType,
      selectData,
      GetTransactionCountQueryKey<config>
    >
>;

export type InjectTransactionCountReturnType<selectData = GetTransactionCountData> = InjectQueryReturnType<
  selectData,
  GetTransactionCountErrorType
>;

/** https://wagmi.sh/react/api/hooks/useTransactionCount */
export function injectTransactionCount<
  config extends Config = ResolvedRegister['config'],
  selectData = GetTransactionCountData,
>(
  parametersFn: () => InjectTransactionCountParameters<config, selectData> = emptyObjFn,
): InjectTransactionCountReturnType<selectData> {
  const config = injectConfig();
  const configChainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { address, query = {} } = parameters;
    const chainId = parameters.chainId ?? configChainId();
    const options = getTransactionCountQueryOptions(config, {
      ...parameters,
      chainId,
    });
    const enabled = Boolean(address && (query.enabled ?? true));
    return { ...queryOptionsSupportBigInt, ...query, ...options, enabled };
  });

  return injectQuery(props) as InjectTransactionCountReturnType<selectData>;
}
