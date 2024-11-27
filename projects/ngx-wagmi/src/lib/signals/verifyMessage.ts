import { computed } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import type { Config, ResolvedRegister, VerifyMessageErrorType } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import type { VerifyMessageQueryFnData } from '@wagmi/core/query';
import {
  type VerifyMessageData,
  type VerifyMessageOptions,
  type VerifyMessageQueryKey,
  verifyMessageQueryOptions,
} from '@wagmi/core/query';
import type { ConfigParameter, QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn, queryOptionsSupportBigInt } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectVerifyMessageParameters<config extends Config = Config, selectData = VerifyMessageData> = Compute<
  VerifyMessageOptions<config> &
    ConfigParameter<config> &
    QueryParameter<VerifyMessageQueryFnData, VerifyMessageErrorType, selectData, VerifyMessageQueryKey<config>>
>;

export type InjectVerifyMessageReturnType<selectData = VerifyMessageData> = InjectQueryReturnType<
  selectData,
  VerifyMessageErrorType
>;

/** https://wagmi.sh/react/api/hooks/useVerifyMessage */
export function injectVerifyMessage<config extends Config = ResolvedRegister['config'], selectData = VerifyMessageData>(
  parametersFn: () => InjectVerifyMessageParameters<config, selectData> = emptyObjFn,
): InjectVerifyMessageReturnType<selectData> {
  const config = injectConfig();
  const configChainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { address, message, signature, query = {} } = parameters;
    const chainId = parameters.chainId ?? configChainId();
    const options = verifyMessageQueryOptions(config, {
      ...parameters,
      chainId,
    });
    const enabled = Boolean(address && message && signature && (query.enabled ?? true));
    return { ...queryOptionsSupportBigInt, ...query, ...options, enabled };
  });

  return injectQuery(props) as InjectVerifyMessageReturnType<selectData>;
}
