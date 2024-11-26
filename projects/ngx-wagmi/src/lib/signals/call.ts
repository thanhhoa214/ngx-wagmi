import type { CallErrorType, Config, ResolvedRegister } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import type { CallQueryFnData } from '@wagmi/core/query';
import { type CallData, type CallOptions, type CallQueryKey, callQueryOptions } from '@wagmi/core/query';

import { computed } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import type { QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn, queryOptionsSupportBigInt } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectCallParameters<config extends Config = Config, selectData = CallData> = Compute<
  CallOptions<config> & QueryParameter<CallQueryFnData, CallErrorType, selectData, CallQueryKey<config>>
>;

export type InjectCallReturnType<selectData = CallData> = InjectQueryReturnType<selectData, CallErrorType>;

export function injectCall<config extends Config = ResolvedRegister['config'], selectData = CallData>(
  parametersFn: () => InjectCallParameters<config, selectData> = emptyObjFn,
): InjectCallReturnType<selectData> {
  const config = injectConfig();
  const configChainId = injectChainId();
  const props = computed(() => {
    const { query = {} } = parametersFn();

    const chainId = parametersFn().chainId ?? configChainId();

    const options = callQueryOptions(config, {
      ...parametersFn(),
      chainId,
    });
    return { ...queryOptionsSupportBigInt, ...query, ...options };
  });

  return injectQuery(props) as InjectCallReturnType<selectData>;
}
