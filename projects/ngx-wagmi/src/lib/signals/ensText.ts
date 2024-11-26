import type { Config, GetEnsTextErrorType, ResolvedRegister } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import {
  type GetEnsTextData,
  type GetEnsTextOptions,
  type GetEnsTextQueryFnData,
  type GetEnsTextQueryKey,
  getEnsTextQueryOptions,
} from '@wagmi/core/query';

import { computed } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import type { ConfigParameter, QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn, queryOptionsSupportBigInt } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectEnsTextParameters<config extends Config = Config, selectData = GetEnsTextData> = Compute<
  GetEnsTextOptions<config> &
    ConfigParameter<config> &
    QueryParameter<GetEnsTextQueryFnData, GetEnsTextErrorType, selectData, GetEnsTextQueryKey<config>>
>;

export type InjectEnsTextReturnType<selectData = GetEnsTextData> = InjectQueryReturnType<
  selectData,
  GetEnsTextErrorType
>;

/** https://wagmi.sh/react/api/hooks/useEnsText */
export function injectEnsText<config extends Config = ResolvedRegister['config'], selectData = GetEnsTextData>(
  parametersFn: () => InjectEnsTextParameters<config, selectData> = emptyObjFn,
): InjectEnsTextReturnType<selectData> {
  const config = injectConfig();
  const configChainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { key, name, query = {} } = parameters;
    const chainId = parameters.chainId ?? configChainId();
    const options = getEnsTextQueryOptions(config, {
      ...parameters,
      chainId,
    });
    const enabled = Boolean(key && name && (query.enabled ?? true));
    return { ...queryOptionsSupportBigInt, ...query, ...options, enabled };
  });

  return injectQuery(props) as InjectEnsTextReturnType<selectData>;
}
