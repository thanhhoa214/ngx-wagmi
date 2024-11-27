import { computed } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import type { Config, ResolvedRegister, VerifyTypedDataErrorType } from '@wagmi/core';
import type { VerifyTypedDataQueryFnData } from '@wagmi/core/query';
import {
  type VerifyTypedDataData,
  type VerifyTypedDataOptions,
  type VerifyTypedDataQueryKey,
  verifyTypedDataQueryOptions,
} from '@wagmi/core/query';
import type { TypedData } from 'viem';
import type { ConfigParameter, QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn, queryOptionsSupportBigInt } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectVerifyTypedDataParameters<
  typedData extends TypedData | Record<string, unknown> = TypedData,
  primaryType extends keyof typedData | 'EIP712Domain' = keyof typedData,
  config extends Config = Config,
  selectData = VerifyTypedDataData,
> = VerifyTypedDataOptions<typedData, primaryType, config> &
  ConfigParameter<config> &
  QueryParameter<
    VerifyTypedDataQueryFnData,
    VerifyTypedDataErrorType,
    selectData,
    VerifyTypedDataQueryKey<typedData, primaryType, config>
  >;

export type InjectVerifyTypedDataReturnType<selectData = VerifyTypedDataData> = InjectQueryReturnType<
  selectData,
  VerifyTypedDataErrorType
>;

/** https://wagmi.sh/react/api/hooks/useVerifyTypedData */
export function injectVerifyTypedData<
  const typedData extends TypedData | Record<string, unknown>,
  primaryType extends keyof typedData | 'EIP712Domain',
  config extends Config = ResolvedRegister['config'],
  selectData = VerifyTypedDataData,
>(
  parametersFn: () => InjectVerifyTypedDataParameters<typedData, primaryType, config, selectData> = emptyObjFn,
): InjectVerifyTypedDataReturnType<selectData> {
  const config = injectConfig();
  const configChainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { address, message, primaryType, signature, types, query = {} } = parameters;
    const chainId = parameters.chainId ?? configChainId();
    const options = verifyTypedDataQueryOptions<config, typedData, primaryType>(config as config, {
      ...parameters,
      chainId,
    });
    const enabled = Boolean(address && message && primaryType && signature && types && (query.enabled ?? true));
    return { ...queryOptionsSupportBigInt, ...query, ...options, enabled };
  });

  return injectQuery(props) as InjectVerifyTypedDataReturnType<selectData>;
}
