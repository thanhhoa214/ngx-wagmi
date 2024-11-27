import type { Config, GetTransactionConfirmationsErrorType, ResolvedRegister } from '@wagmi/core';
import {
  type GetTransactionConfirmationsData,
  type GetTransactionConfirmationsOptions,
  type GetTransactionConfirmationsQueryFnData,
  type GetTransactionConfirmationsQueryKey,
  getTransactionConfirmationsQueryOptions,
} from '@wagmi/core/query';

import { computed } from '@angular/core';
import { CreateQueryOptions, injectQuery } from '@tanstack/angular-query-experimental';
import type { ConfigParameter, QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn, queryOptionsSupportBigInt } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectTransactionConfirmationsParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | undefined = undefined,
  selectData = GetTransactionConfirmationsData,
> = GetTransactionConfirmationsOptions<config, chainId> &
  ConfigParameter<config> &
  QueryParameter<
    GetTransactionConfirmationsQueryFnData,
    GetTransactionConfirmationsErrorType,
    selectData,
    GetTransactionConfirmationsQueryKey<config, chainId>
  >;

export type InjectTransactionConfirmationsReturnType<selectData = GetTransactionConfirmationsData> =
  InjectQueryReturnType<selectData, GetTransactionConfirmationsErrorType>;

/** https://wagmi.sh/react/api/hooks/useTransactionConfirmations */
export function injectTransactionConfirmations<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] | undefined = undefined,
  selectData = GetTransactionConfirmationsData,
>(
  parametersFn: () => InjectTransactionConfirmationsParameters<config, chainId, selectData> = emptyObjFn as any,
): InjectTransactionConfirmationsReturnType<selectData> {
  const config = injectConfig();
  const configChainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { hash, transactionReceipt, query = {} } = parameters;
    const chainId = parameters.chainId ?? configChainId();
    const options = getTransactionConfirmationsQueryOptions(config, {
      ...parameters,
      chainId,
    });
    const enabled = Boolean(!(hash && transactionReceipt) && (hash || transactionReceipt) && (query.enabled ?? true));
    return { ...queryOptionsSupportBigInt, ...query, ...options, enabled } as unknown as CreateQueryOptions<
      config,
      chainId
    >;
  });

  return injectQuery(props) as unknown as InjectTransactionConfirmationsReturnType<selectData>;
}
