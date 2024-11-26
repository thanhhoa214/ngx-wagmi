import type { Config, EstimateMaxPriorityFeePerGasErrorType, ResolvedRegister } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import {
  type EstimateMaxPriorityFeePerGasData,
  type EstimateMaxPriorityFeePerGasOptions,
  type EstimateMaxPriorityFeePerGasQueryFnData,
  type EstimateMaxPriorityFeePerGasQueryKey,
  estimateMaxPriorityFeePerGasQueryOptions,
} from '@wagmi/core/query';

import { computed } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import type { ConfigParameter, QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn, queryOptionsSupportBigInt } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectEstimateMaxPriorityFeePerGasParameters<
  config extends Config = Config,
  selectData = EstimateMaxPriorityFeePerGasData,
> = Compute<
  EstimateMaxPriorityFeePerGasOptions<config> &
    ConfigParameter<config> &
    QueryParameter<
      EstimateMaxPriorityFeePerGasQueryFnData,
      EstimateMaxPriorityFeePerGasErrorType,
      selectData,
      EstimateMaxPriorityFeePerGasQueryKey<config>
    >
>;

export type InjectEstimateMaxPriorityFeePerGasReturnType<selectData = EstimateMaxPriorityFeePerGasData> =
  InjectQueryReturnType<selectData, EstimateMaxPriorityFeePerGasErrorType>;

export function injectEstimateMaxPriorityFeePerGas<
  config extends Config = ResolvedRegister['config'],
  selectData = EstimateMaxPriorityFeePerGasData,
>(
  parametersFn: () => InjectEstimateMaxPriorityFeePerGasParameters<config, selectData> = emptyObjFn,
): InjectEstimateMaxPriorityFeePerGasReturnType<selectData> {
  const config = injectConfig();
  const configChainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { query = {} } = parameters;
    const chainId = parameters.chainId ?? configChainId();
    const options = estimateMaxPriorityFeePerGasQueryOptions(config, {
      ...parameters,
      chainId,
    });
    return { ...queryOptionsSupportBigInt, ...query, ...options };
  });

  return injectQuery(props) as InjectEstimateMaxPriorityFeePerGasReturnType<selectData>;
}
