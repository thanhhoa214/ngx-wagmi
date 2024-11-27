import { computed } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import type { Config, GetTransactionReceiptErrorType, ResolvedRegister } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import type { GetTransactionReceiptQueryFnData } from '@wagmi/core/query';
import {
  type GetTransactionReceiptData,
  type GetTransactionReceiptOptions,
  type GetTransactionReceiptQueryKey,
  getTransactionReceiptQueryOptions,
} from '@wagmi/core/query';
import type { ConfigParameter, QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn, queryOptionsSupportBigInt } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectTransactionReceiptParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetTransactionReceiptData<config, chainId>,
> = Compute<
  GetTransactionReceiptOptions<config, chainId> &
    ConfigParameter<config> &
    QueryParameter<
      GetTransactionReceiptQueryFnData<config, chainId>,
      GetTransactionReceiptErrorType,
      selectData,
      GetTransactionReceiptQueryKey<config, chainId>
    >
>;

export type InjectTransactionReceiptReturnType<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetTransactionReceiptData<config, chainId>,
> = InjectQueryReturnType<selectData, GetTransactionReceiptErrorType>;

/** https://wagmi.sh/react/api/hooks/useTransactionReceipt */
export function injectTransactionReceipt<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetTransactionReceiptData<config, chainId>,
>(
  parametersFn: () => InjectTransactionReceiptParameters<config, chainId, selectData> = emptyObjFn,
): InjectTransactionReceiptReturnType<config, chainId, selectData> {
  const config = injectConfig();
  const configChainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { hash, query = {} } = parameters;
    const chainId = parameters.chainId ?? configChainId();
    const options = getTransactionReceiptQueryOptions(config, {
      ...parameters,
      chainId,
    });
    const enabled = Boolean(hash && (query.enabled ?? true));
    return {
      ...queryOptionsSupportBigInt,
      ...(query as any),
      ...options,
      enabled,
    };
  });

  return injectQuery(props) as unknown as InjectTransactionReceiptReturnType<config, chainId, selectData>;
}
