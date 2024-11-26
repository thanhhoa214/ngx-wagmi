import type { Config, EstimateGasErrorType } from '@wagmi/core';
import {
  type EstimateGasData,
  type EstimateGasOptions,
  type EstimateGasQueryFnData,
  type EstimateGasQueryKey,
  estimateGasQueryOptions,
} from '@wagmi/core/query';

import { computed } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import type { QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn, queryOptionsSupportBigInt } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';
import { injectConnectorClient } from './connectorClient';

export type InjectEstimateGasParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | undefined = undefined,
  selectData = EstimateGasData,
> = EstimateGasOptions<config, chainId> &
  QueryParameter<EstimateGasQueryFnData, EstimateGasErrorType, selectData, EstimateGasQueryKey<config, chainId>>;

export type InjectEstimateGasReturnType<selectData = EstimateGasData> = InjectQueryReturnType<
  selectData,
  EstimateGasErrorType
>;

export function injectEstimateGas(
  parametersFn: () => InjectEstimateGasParameters = emptyObjFn,
): InjectEstimateGasReturnType {
  const config = injectConfig();
  const configChainId = injectChainId();
  const { data: connectorClient } = injectConnectorClient(() => {
    const parameters = parametersFn();
    return {
      connector: parameters.connector,
      query: { enabled: parameters.account === undefined },
    };
  });

  const props = computed(() => {
    const parameters = parametersFn();
    const { connector, query = {} } = parameters;
    const account = parameters.account ?? connectorClient()?.account;
    const chainId = parameters.chainId ?? configChainId();
    const options = estimateGasQueryOptions(config, {
      ...parameters,
      account,
      chainId,
      connector,
    });
    const enabled = Boolean((account || connector) && (query.enabled ?? true));
    return { ...queryOptionsSupportBigInt, ...query, ...options, enabled };
  });
  return injectQuery(props) as InjectEstimateGasReturnType;
}
