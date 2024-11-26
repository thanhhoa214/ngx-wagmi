import type { Config, GetProofErrorType, ResolvedRegister } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import type { GetProofQueryFnData } from '@wagmi/core/query';
import {
  type GetProofData,
  type GetProofOptions,
  type GetProofQueryKey,
  getProofQueryOptions,
} from '@wagmi/core/query';

import { computed } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import type { ConfigParameter, QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectProofParameters<config extends Config = Config, selectData = GetProofData> = Compute<
  GetProofOptions<config> &
    ConfigParameter<config> &
    QueryParameter<GetProofQueryFnData, GetProofErrorType, selectData, GetProofQueryKey<config>>
>;

export type InjectProofReturnType<selectData = GetProofData> = InjectQueryReturnType<selectData, GetProofErrorType>;

export function injectProof<config extends Config = ResolvedRegister['config'], selectData = GetProofData>(
  parametersFn: () => InjectProofParameters<config, selectData> = emptyObjFn,
): InjectProofReturnType<selectData> {
  const config = injectConfig();
  const configChainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { address, storageKeys, query = {} } = parameters;
    const chainId = parameters.chainId ?? configChainId();
    const options = getProofQueryOptions(config, {
      ...parameters,
      chainId,
    });
    const enabled = Boolean(address && storageKeys && (query.enabled ?? true));
    return { ...query, ...options, enabled };
  });

  return injectQuery(props) as InjectProofReturnType<selectData>;
}
