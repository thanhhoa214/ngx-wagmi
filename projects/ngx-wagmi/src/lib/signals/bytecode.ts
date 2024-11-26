import { computed } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import type { Config, GetBytecodeErrorType, ResolvedRegister } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import type { GetBytecodeQueryFnData } from '@wagmi/core/query';
import {
  type GetBytecodeData,
  type GetBytecodeOptions,
  type GetBytecodeQueryKey,
  getBytecodeQueryOptions,
} from '@wagmi/core/query';
import type { ConfigParameter, QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn, queryOptionsSupportBigInt } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectBytecodeParameters<config extends Config = Config, selectData = GetBytecodeData> = Compute<
  GetBytecodeOptions<config> &
    ConfigParameter<config> &
    QueryParameter<GetBytecodeQueryFnData, GetBytecodeErrorType, selectData, GetBytecodeQueryKey<config>>
>;

export type InjectBytecodeReturnType<selectData = GetBytecodeData> = InjectQueryReturnType<
  selectData,
  GetBytecodeErrorType
>;

export function injectBytecode<config extends Config = ResolvedRegister['config'], selectData = GetBytecodeData>(
  parametersFn: () => InjectBytecodeParameters<config, selectData> = emptyObjFn,
): InjectBytecodeReturnType<selectData> {
  const config = injectConfig();
  const configChainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { address, query = {} } = parameters;
    const chainId = parameters.chainId ?? configChainId();
    const options = getBytecodeQueryOptions(config, {
      ...parameters,
      chainId,
    });
    const enabled = Boolean(address && (query.enabled ?? true));
    return { ...queryOptionsSupportBigInt, ...query, ...options, enabled };
  });

  return injectQuery(props) as InjectBytecodeReturnType<selectData>;
}
