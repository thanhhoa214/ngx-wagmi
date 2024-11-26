import type { Config, GetGasPriceErrorType, ResolvedRegister } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import {
  type GetGasPriceData,
  type GetGasPriceOptions,
  type GetGasPriceQueryFnData,
  type GetGasPriceQueryKey,
  getGasPriceQueryOptions,
} from '@wagmi/core/query';

import { computed } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import type { ConfigParameter, QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn, queryOptionsSupportBigInt } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectGasPriceParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetGasPriceData,
> = Compute<
  GetGasPriceOptions<config, chainId> &
    ConfigParameter<config> &
    QueryParameter<GetGasPriceQueryFnData, GetGasPriceErrorType, selectData, GetGasPriceQueryKey<config, chainId>>
>;

export type InjectGasPriceReturnType<selectData = GetGasPriceData> = InjectQueryReturnType<
  selectData,
  GetGasPriceErrorType
>;

export function injectGasPrice<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetGasPriceData,
>(
  parametersFn: () => InjectGasPriceParameters<config, chainId, selectData> = emptyObjFn,
): InjectGasPriceReturnType<selectData> {
  const config = injectConfig();
  const configChainId = injectChainId();

  const props = computed(() => {
    const { query = {} } = parametersFn();
    const chainId = parametersFn().chainId ?? configChainId();
    const options = getGasPriceQueryOptions(config, {
      ...parametersFn(),
      chainId,
    });
    return { ...queryOptionsSupportBigInt, ...query, ...options };
  });

  return injectQuery(props) as InjectGasPriceReturnType<selectData>;
}
