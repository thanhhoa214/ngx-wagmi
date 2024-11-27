import { computed, effect, signal } from '@angular/core';
import { CreateQueryOptions, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import type { Config, GetWalletClientErrorType, ResolvedRegister } from '@wagmi/core';
import type { Compute, Omit } from '@wagmi/core/internal';
import {
  type GetWalletClientData,
  type GetWalletClientOptions,
  type GetWalletClientQueryFnData,
  type GetWalletClientQueryKey,
  getWalletClientQueryOptions,
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

export type InjectWalletClientParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetWalletClientData<config, chainId>,
> = Compute<
  GetWalletClientOptions<config, chainId> &
    ConfigParameter<config> & {
      query?:
        | Compute<
            Omit<
              InjectQueryParameters<
                GetWalletClientQueryFnData<config, chainId>,
                GetWalletClientErrorType,
                selectData,
                GetWalletClientQueryKey<config, chainId>
              >,
              'gcTime' | 'staleTime'
            >
          >
        | undefined;
    }
>;

export type InjectWalletClientReturnType<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetWalletClientData<config, chainId>,
> = InjectQueryReturnType<selectData, GetWalletClientErrorType>;

/** https://wagmi.sh/react/api/hooks/useWalletClient */
export function injectWalletClient<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
  selectData = GetWalletClientData<config, chainId>,
>(parametersFn: () => InjectWalletClientParameters<config, chainId, selectData> = emptyObjFn) {
  const config = injectConfig();
  const queryClient = injectQueryClient();
  const account = injectAccount({ config });
  const configChainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { query = {} } = parameters;
    const { connector, status } = account();
    const chainId = parameters.chainId ?? configChainId();
    const activeConnector = parameters.connector ?? connector;
    const options = getWalletClientQueryOptions<config, chainId>(config as config, {
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
      enabled,
      staleTime: Number.POSITIVE_INFINITY,
    } as unknown as CreateQueryOptions<config, chainId>;
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
