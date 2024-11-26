import type { Config, GetEnsAvatarErrorType, ResolvedRegister } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import {
  type GetEnsAvatarData,
  type GetEnsAvatarOptions,
  type GetEnsAvatarQueryFnData,
  type GetEnsAvatarQueryKey,
  getEnsAvatarQueryOptions,
} from '@wagmi/core/query';

import { computed } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import type { ConfigParameter, QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn, queryOptionsSupportBigInt } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectEnsAvatarParameters<config extends Config = Config, selectData = GetEnsAvatarData> = Compute<
  GetEnsAvatarOptions<config> &
    ConfigParameter<config> &
    QueryParameter<GetEnsAvatarQueryFnData, GetEnsAvatarErrorType, selectData, GetEnsAvatarQueryKey<config>>
>;

export type InjectEnsAvatarReturnType<selectData = GetEnsAvatarData> = InjectQueryReturnType<
  selectData,
  GetEnsAvatarErrorType
>;

export function injectEnsAvatar<config extends Config = ResolvedRegister['config'], selectData = GetEnsAvatarData>(
  parametersFn: () => InjectEnsAvatarParameters<config, selectData> = emptyObjFn,
): InjectEnsAvatarReturnType<selectData> {
  const config = injectConfig();
  const configChainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { name, query = {} } = parameters;
    const chainId = parameters.chainId ?? configChainId();
    const options = getEnsAvatarQueryOptions(config, {
      ...parameters,
      chainId,
    });
    const enabled = Boolean(name && (query.enabled ?? true));
    return { ...queryOptionsSupportBigInt, ...query, ...options, enabled };
  });

  return injectQuery(props) as InjectEnsAvatarReturnType<selectData>;
}