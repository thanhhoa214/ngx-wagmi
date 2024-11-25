import { computed } from '@angular/core';

import { injectQuery } from '@tanstack/angular-query-experimental';
import {
  type Config,
  type GetBalanceErrorType,
  type ResolvedRegister,
} from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import {
  type GetBalanceData,
  type GetBalanceOptions,
  type GetBalanceQueryFnData,
  type GetBalanceQueryKey,
  getBalanceQueryOptions,
} from '@wagmi/core/query';

import type {
  ConfigParameter,
  QueryParameter,
} from '../types/properties';
import { InjectQueryReturnType } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

const emptyObjFn = () => ({});

export type InjectBalanceParameters<
  config extends Config = Config,
  selectData = GetBalanceData
> = Compute<
  GetBalanceOptions<config> &
    ConfigParameter<config> &
    QueryParameter<
      GetBalanceQueryFnData,
      GetBalanceErrorType,
      selectData,
      GetBalanceQueryKey<config>
    >
>;

export type InjectBalanceReturnType<selectData = GetBalanceData> =
  InjectQueryReturnType<selectData, GetBalanceErrorType>;

export function injectBalance<
  config extends Config = ResolvedRegister['config'],
  selectData = GetBalanceData
>(
  parametersFn: () => InjectBalanceParameters<config, selectData> = emptyObjFn
) {
  const config = injectConfig(parametersFn());
  const chainId = injectChainId({ config });
  const props = computed(() => {
    const parameters = parametersFn();
    const { address, query = {} } = parameters;
    const options = getBalanceQueryOptions(config, {
      ...parameters,
      chainId: parameters.chainId ?? chainId(),
    });
    const enabled = Boolean(address && (query.enabled ?? true));

    return { ...query, ...options, enabled };
  });

  return injectQuery(props);
}
