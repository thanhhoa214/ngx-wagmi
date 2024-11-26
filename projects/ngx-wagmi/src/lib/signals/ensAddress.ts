import type { Config, GetEnsAddressErrorType, ResolvedRegister } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import {
  type GetEnsAddressData,
  type GetEnsAddressOptions,
  type GetEnsAddressQueryFnData,
  type GetEnsAddressQueryKey,
  getEnsAddressQueryOptions,
} from '@wagmi/core/query';

import { computed } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import type { ConfigParameter, QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn, queryOptionsSupportBigInt } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectEnsAddressParameters<config extends Config = Config, selectData = GetEnsAddressData> = Compute<
  GetEnsAddressOptions<config> &
    ConfigParameter<config> &
    QueryParameter<GetEnsAddressQueryFnData, GetEnsAddressErrorType, selectData, GetEnsAddressQueryKey<config>>
>;

export type InjectEnsAddressReturnType<selectData = GetEnsAddressData> = InjectQueryReturnType<
  selectData,
  GetEnsAddressErrorType
>;

export function injectEnsAddress<config extends Config = ResolvedRegister['config'], selectData = GetEnsAddressData>(
  parametersFn: () => InjectEnsAddressParameters<config, selectData> = emptyObjFn,
): InjectEnsAddressReturnType<selectData> {
  const config = injectConfig();
  const configChainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { name, query = {} } = parameters;
    const chainId = parameters.chainId ?? configChainId();
    const options = getEnsAddressQueryOptions(config, {
      ...parameters,
      chainId,
    });
    const enabled = Boolean(name && (query.enabled ?? true));
    return { ...queryOptionsSupportBigInt, ...query, ...options, enabled };
  });
  return injectQuery(props) as InjectEnsAddressReturnType<selectData>;
}
