import { computed } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import type { Config, ResolvedRegister, WaitForTransactionReceiptErrorType } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import {
  type WaitForTransactionReceiptData,
  type WaitForTransactionReceiptOptions,
  type WaitForTransactionReceiptQueryFnData,
  type WaitForTransactionReceiptQueryKey,
  waitForTransactionReceiptQueryOptions,
} from '@wagmi/core/query';
import type { ConfigParameter, QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectWaitForTransactionReceiptParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = WaitForTransactionReceiptData<config, chainId>,
> = Compute<
  WaitForTransactionReceiptOptions<config, chainId> &
    ConfigParameter<config> &
    QueryParameter<
      WaitForTransactionReceiptQueryFnData<config, chainId>,
      WaitForTransactionReceiptErrorType,
      selectData,
      WaitForTransactionReceiptQueryKey<config, chainId>
    >
>;

export type InjectWaitForTransactionReceiptReturnType<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = WaitForTransactionReceiptData<config, chainId>,
> = InjectQueryReturnType<selectData, WaitForTransactionReceiptErrorType>;

/** https://wagmi.sh/react/api/hooks/useWaitForTransactionReceipt */
export function injectWaitForTransactionReceipt<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = WaitForTransactionReceiptData<config, chainId>,
>(
  parametersFn: () => InjectWaitForTransactionReceiptParameters<config, chainId, selectData> = emptyObjFn,
): InjectWaitForTransactionReceiptReturnType<config, chainId, selectData> {
  const config = injectConfig();
  const configChainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { hash, query = {} } = parameters;
    const chainId = parameters.chainId ?? configChainId();
    const options = waitForTransactionReceiptQueryOptions(config, {
      ...parameters,
      chainId,
    });
    const enabled = Boolean(hash && (query.enabled ?? true));
    return {
      ...(query as any),
      ...options,
      enabled,
    };
  });

  return injectQuery(props) as unknown as InjectWaitForTransactionReceiptReturnType<config, chainId, selectData>;
}
