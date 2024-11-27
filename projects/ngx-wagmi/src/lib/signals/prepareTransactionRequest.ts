import type { Config, PrepareTransactionRequestErrorType, ResolvedRegister, SelectChains } from '@wagmi/core';
import type { PrepareTransactionRequestQueryFnData } from '@wagmi/core/query';
import {
  type PrepareTransactionRequestData,
  type PrepareTransactionRequestOptions,
  type PrepareTransactionRequestQueryKey,
  prepareTransactionRequestQueryOptions,
} from '@wagmi/core/query';
import type { PrepareTransactionRequestRequest as viem_PrepareTransactionRequestRequest } from 'viem';

import { computed } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import type { ConfigParameter, QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn, queryOptionsSupportBigInt } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectPrepareTransactionRequestParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | undefined = undefined,
  request extends viem_PrepareTransactionRequestRequest<
    SelectChains<config, chainId>[0],
    SelectChains<config, chainId>[0]
  > = viem_PrepareTransactionRequestRequest<SelectChains<config, chainId>[0], SelectChains<config, chainId>[0]>,
  selectData = PrepareTransactionRequestData<config, chainId, request>,
> = PrepareTransactionRequestOptions<config, chainId, request> &
  ConfigParameter<config> &
  QueryParameter<
    PrepareTransactionRequestQueryFnData<config, chainId, request>,
    PrepareTransactionRequestErrorType,
    selectData,
    PrepareTransactionRequestQueryKey<config, chainId, request>
  >;

export type InjectPrepareTransactionRequestReturnType<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | undefined = undefined,
  request extends viem_PrepareTransactionRequestRequest<
    SelectChains<config, chainId>[0],
    SelectChains<config, chainId>[0]
  > = viem_PrepareTransactionRequestRequest<SelectChains<config, chainId>[0], SelectChains<config, chainId>[0]>,
  selectData = PrepareTransactionRequestData<config, chainId, request>,
> = InjectQueryReturnType<selectData, PrepareTransactionRequestErrorType>;

export function injectPrepareTransactionRequest<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] | undefined = undefined,
  request extends viem_PrepareTransactionRequestRequest<
    SelectChains<config, chainId>[0],
    SelectChains<config, chainId>[0]
  > = viem_PrepareTransactionRequestRequest<SelectChains<config, chainId>[0], SelectChains<config, chainId>[0]>,
  selectData = PrepareTransactionRequestData<config, chainId, request>,
>(
  parametersFn: () => InjectPrepareTransactionRequestParameters<
    config,
    chainId,
    request,
    selectData
  > = emptyObjFn as any,
) {
  const config = injectConfig();
  const configChainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { to, query = {} } = parameters;
    const chainId = parameters.chainId ?? configChainId();
    const options = prepareTransactionRequestQueryOptions<config, chainId, request>(
      config as config,
      {
        ...parameters,
        chainId,
      } as PrepareTransactionRequestOptions<config, chainId, request>,
    );
    const enabled = Boolean(to && (query.enabled ?? true));
    return { ...queryOptionsSupportBigInt, ...query, ...options, enabled };
  });

  return injectQuery(props) as unknown as InjectPrepareTransactionRequestReturnType<
    config,
    chainId,
    request,
    selectData
  >;
}
