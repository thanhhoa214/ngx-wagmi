import type { Config, GetEnsResolverErrorType, ResolvedRegister } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import {
  type GetEnsResolverData,
  type GetEnsResolverOptions,
  type GetEnsResolverQueryFnData,
  type GetEnsResolverQueryKey,
  getEnsResolverQueryOptions,
} from '@wagmi/core/query';

import { computed } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import type { ConfigParameter, QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn, queryOptionsSupportBigInt } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectEnsResolverParameters<config extends Config = Config, selectData = GetEnsResolverData> = Compute<
  GetEnsResolverOptions<config> &
    ConfigParameter<config> &
    QueryParameter<GetEnsResolverQueryFnData, GetEnsResolverErrorType, selectData, GetEnsResolverQueryKey<config>>
>;

export type InjectEnsResolverReturnType<selectData = GetEnsResolverData> = InjectQueryReturnType<
  selectData,
  GetEnsResolverErrorType
>;

export function injectEnsResolver<config extends Config = ResolvedRegister['config'], selectData = GetEnsResolverData>(
  parametersFn: () => InjectEnsResolverParameters<config, selectData> = emptyObjFn,
): InjectEnsResolverReturnType<selectData> {
  const config = injectConfig();
  const configChainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { name, query = {} } = parameters;
    const chainId = parameters.chainId ?? configChainId();
    const options = getEnsResolverQueryOptions(config, {
      ...parameters,
      chainId,
    });
    const enabled = Boolean(name && (query.enabled ?? true));
    return { ...queryOptionsSupportBigInt, ...query, ...options, enabled };
  });
  return injectQuery(props) as InjectEnsResolverReturnType<selectData>;
}
