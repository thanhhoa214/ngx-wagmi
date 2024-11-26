import { computed, effect, signal } from '@angular/core';
import { injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import type { Config, GetConnectorClientErrorType, ResolvedRegister } from '@wagmi/core';
import type { Compute, Omit } from '@wagmi/core/internal';
import {
  type GetConnectorClientData,
  type GetConnectorClientOptions,
  type GetConnectorClientQueryFnData,
  type GetConnectorClientQueryKey,
  getConnectorClientQueryOptions,
} from '@wagmi/core/query';
import type { ConfigParameter } from '../types/properties';
import {
  type InjectQueryParameters,
  type InjectQueryReturnType,
  emptyObjFn,
  queryOptionsSupportBigInt,
} from '../utils/query';
import { injectAccount } from './account';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectConnectorClientParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetConnectorClientData<config, chainId>,
> = Compute<
  GetConnectorClientOptions<config, chainId> &
    ConfigParameter<config> & {
      query?:
        | Compute<
            Omit<
              InjectQueryParameters<
                GetConnectorClientQueryFnData<config, chainId>,
                GetConnectorClientErrorType,
                selectData,
                GetConnectorClientQueryKey<config, chainId>
              >,
              'gcTime' | 'staleTime'
            >
          >
        | undefined;
    }
>;

export type InjectConnectorClientReturnType<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetConnectorClientData<config, chainId>,
> = InjectQueryReturnType<selectData, GetConnectorClientErrorType>;

export function injectConnectorClient<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetConnectorClientData<config, chainId>,
>(parametersFn: () => InjectConnectorClientParameters<config, chainId, selectData> = emptyObjFn) {
  const config = injectConfig();
  const queryClient = injectQueryClient();
  const configChainId = injectChainId();
  const account = injectAccount({ config });

  const props = computed(() => {
    const parameters = parametersFn();
    const { query = {} } = parameters;

    const { connector, status } = account();
    const chainId = parameters.chainId ?? configChainId();
    const activeConnector = parameters.connector ?? connector;

    const { queryKey, ...options } = getConnectorClientQueryOptions<config, chainId>(config as config, {
      ...parameters,
      chainId,
      connector: activeConnector,
    });
    const enabled = Boolean(
      (status === 'connected' || (status === 'reconnecting' && activeConnector?.getProvider)) &&
        (query.enabled ?? true),
    );

    return {
      ...queryOptionsSupportBigInt,
      ...query,
      ...options,
      queryKey,
      enabled,
      staleTime: Number.POSITIVE_INFINITY,
    };
  });

  const preAddress = signal(account().address);
  effect(
    () => {
      const { address } = account();
      const { queryKey } = props();
      const previousAddress = preAddress();

      if (!address && previousAddress) {
        // remove when account is disconnected
        queryClient.removeQueries({ queryKey });
        preAddress.set(undefined);
      } else if (address !== previousAddress) {
        // invalidate when address changes
        queryClient.invalidateQueries({ queryKey });
        preAddress.set(address);
      }
    },
    { allowSignalWrites: true },
  );

  return injectQuery(props);
}
