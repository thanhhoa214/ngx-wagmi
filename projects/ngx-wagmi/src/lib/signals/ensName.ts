import type { Config, GetEnsNameErrorType, ResolvedRegister } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import {
  type GetEnsNameData,
  type GetEnsNameOptions,
  type GetEnsNameQueryFnData,
  type GetEnsNameQueryKey,
  getEnsNameQueryOptions,
} from '@wagmi/core/query';

import { computed } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import type { ConfigParameter, QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn, queryOptionsSupportBigInt } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectEnsNameParameters<config extends Config = Config, selectData = GetEnsNameData> = Compute<
  GetEnsNameOptions<config> &
    ConfigParameter<config> &
    QueryParameter<GetEnsNameQueryFnData, GetEnsNameErrorType, selectData, GetEnsNameQueryKey<config>>
>;

export type InjectEnsNameReturnType<selectData = GetEnsNameData> = InjectQueryReturnType<
  selectData,
  GetEnsNameErrorType
>;

export function injectEnsName<config extends Config = ResolvedRegister['config'], selectData = GetEnsNameData>(
  parametersFn: () => InjectEnsNameParameters<config, selectData> = emptyObjFn,
): InjectEnsNameReturnType<selectData> {
  const config = injectConfig();
  const configChainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { address, query = {} } = parameters;
    const chainId = parameters.chainId ?? configChainId();
    const options = getEnsNameQueryOptions(config, {
      ...parameters,
      chainId,
    });
    const enabled = Boolean(address && (query.enabled ?? true));
    return { ...queryOptionsSupportBigInt, ...query, ...options, enabled };
  });

  return injectQuery(props) as InjectEnsNameReturnType<selectData>;
}
