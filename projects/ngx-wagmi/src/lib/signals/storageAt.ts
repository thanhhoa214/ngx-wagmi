import { computed } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import type { Config, GetStorageAtErrorType, ResolvedRegister } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import type { GetStorageAtQueryFnData } from '@wagmi/core/query';
import {
  type GetStorageAtData,
  type GetStorageAtOptions,
  type GetStorageAtQueryKey,
  getStorageAtQueryOptions,
} from '@wagmi/core/query';
import type { ConfigParameter, QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn, queryOptionsSupportBigInt } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectStorageAtParameters<config extends Config = Config, selectData = GetStorageAtData> = Compute<
  GetStorageAtOptions<config> &
    ConfigParameter<config> &
    QueryParameter<GetStorageAtQueryFnData, GetStorageAtErrorType, selectData, GetStorageAtQueryKey<config>>
>;

export type InjectStorageAtReturnType<selectData = GetStorageAtData> = InjectQueryReturnType<
  selectData,
  GetStorageAtErrorType
>;

export function injectStorageAt<config extends Config = ResolvedRegister['config'], selectData = GetStorageAtData>(
  parametersFn: () => InjectStorageAtParameters<config, selectData> = emptyObjFn,
): InjectStorageAtReturnType<selectData> {
  const config = injectConfig();
  const configChainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { address, slot, query = {} } = parameters;
    const chainId = parameters.chainId ?? configChainId();
    const options = getStorageAtQueryOptions(config, {
      ...parameters,
      chainId,
    });
    const enabled = Boolean(address && slot && (query.enabled ?? true));
    return { ...queryOptionsSupportBigInt, ...query, ...options, enabled };
  });

  return injectQuery(props) as InjectStorageAtReturnType<selectData>;
}
