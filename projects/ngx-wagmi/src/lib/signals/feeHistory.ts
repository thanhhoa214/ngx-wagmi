import type { Config, GetFeeHistoryErrorType, ResolvedRegister } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import {
  type GetFeeHistoryData,
  type GetFeeHistoryOptions,
  type GetFeeHistoryQueryFnData,
  type GetFeeHistoryQueryKey,
  getFeeHistoryQueryOptions,
} from '@wagmi/core/query';

import { computed } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import type { ConfigParameter, QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn, queryOptionsSupportBigInt } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectFeeHistoryParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetFeeHistoryData,
> = Compute<
  GetFeeHistoryOptions<config, chainId> &
    ConfigParameter<config> &
    QueryParameter<GetFeeHistoryQueryFnData, GetFeeHistoryErrorType, selectData, GetFeeHistoryQueryKey<config, chainId>>
>;

export type InjectFeeHistoryReturnType<selectData = GetFeeHistoryData> = InjectQueryReturnType<
  selectData,
  GetFeeHistoryErrorType
>;

/** https://wagmi.sh/react/api/hooks/useFeeHistory */
export function injectFeeHistory<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetFeeHistoryData,
>(
  parametersFn: () => InjectFeeHistoryParameters<config, chainId, selectData> = emptyObjFn,
): InjectFeeHistoryReturnType<selectData> {
  const config = injectConfig();
  const configChainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { blockCount, rewardPercentiles, query = {} } = parameters;
    const chainId = parameters.chainId ?? configChainId();
    const options = getFeeHistoryQueryOptions(config, {
      ...parameters,
      chainId,
    });
    const enabled = Boolean(blockCount && rewardPercentiles && (query.enabled ?? true));
    return { ...queryOptionsSupportBigInt, ...query, ...options, enabled };
  });

  return injectQuery(props) as InjectFeeHistoryReturnType<selectData>;
}
