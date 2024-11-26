import { computed } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import type { Config, EstimateFeesPerGasErrorType, ResolvedRegister } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import {
  type EstimateFeesPerGasData,
  type EstimateFeesPerGasOptions,
  type EstimateFeesPerGasQueryFnData,
  type EstimateFeesPerGasQueryKey,
  estimateFeesPerGasQueryOptions,
} from '@wagmi/core/query';
import type { FeeValuesType } from 'viem';
import type { ConfigParameter, QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn, queryOptionsSupportBigInt } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectEstimateFeesPerGasParameters<
  type extends FeeValuesType = FeeValuesType,
  config extends Config = Config,
  selectData = EstimateFeesPerGasData<type>,
> = Compute<
  EstimateFeesPerGasOptions<type, config> &
    ConfigParameter<config> &
    QueryParameter<
      EstimateFeesPerGasQueryFnData<type>,
      EstimateFeesPerGasErrorType,
      selectData,
      EstimateFeesPerGasQueryKey<config, type>
    >
>;

export type InjectEstimateFeesPerGasReturnType<
  type extends FeeValuesType = FeeValuesType,
  selectData = EstimateFeesPerGasData<type>,
> = InjectQueryReturnType<selectData, EstimateFeesPerGasErrorType>;

/** https://wagmi.sh/react/api/hooks/useEstimateFeesPerGas */
export function injectEstimateFeesPerGas<
  config extends Config = ResolvedRegister['config'],
  type extends FeeValuesType = 'eip1559',
  selectData = EstimateFeesPerGasData<type>,
>(
  parametersFn: () => InjectEstimateFeesPerGasParameters<type, config, selectData> = emptyObjFn,
): InjectEstimateFeesPerGasReturnType<type, selectData> {
  const config = injectConfig();
  const configChainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { query = {} } = parameters;
    const chainId = parameters.chainId ?? configChainId();
    const options = estimateFeesPerGasQueryOptions(config, {
      ...parameters,
      chainId,
    });
    return { ...queryOptionsSupportBigInt, ...query, ...options };
  });

  return injectQuery(props) as InjectEstimateFeesPerGasReturnType<type, selectData>;
}
