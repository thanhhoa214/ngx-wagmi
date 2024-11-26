import type { Config, ResolvedRegister, SimulateContractErrorType } from '@wagmi/core';
import {
  type SimulateContractData,
  type SimulateContractOptions,
  type SimulateContractQueryFnData,
  type SimulateContractQueryKey,
  simulateContractQueryOptions,
} from '@wagmi/core/query';
import type { Abi, ContractFunctionArgs, ContractFunctionName } from 'viem';

import { computed } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import type { ConfigParameter, QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn, queryOptionsSupportBigInt } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';
import { injectConnectorClient } from './connectorClient';

export type InjectSimulateContractParameters<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<abi, 'nonpayable' | 'payable'> = ContractFunctionName<
    abi,
    'nonpayable' | 'payable'
  >,
  args extends ContractFunctionArgs<abi, 'nonpayable' | 'payable', functionName> = ContractFunctionArgs<
    abi,
    'nonpayable' | 'payable',
    functionName
  >,
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | undefined = undefined,
  selectData = SimulateContractData<abi, functionName, args, config, chainId>,
> = SimulateContractOptions<abi, functionName, args, config, chainId> &
  ConfigParameter<config> &
  QueryParameter<
    SimulateContractQueryFnData<abi, functionName, args, config, chainId>,
    SimulateContractErrorType,
    selectData,
    SimulateContractQueryKey<abi, functionName, args, config, chainId>
  >;

export type InjectSimulateContractReturnType<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<abi, 'nonpayable' | 'payable'> = ContractFunctionName<
    abi,
    'nonpayable' | 'payable'
  >,
  args extends ContractFunctionArgs<abi, 'nonpayable' | 'payable', functionName> = ContractFunctionArgs<
    abi,
    'nonpayable' | 'payable',
    functionName
  >,
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] | undefined = undefined,
  selectData = SimulateContractData<abi, functionName, args, config, chainId>,
> = InjectQueryReturnType<selectData, SimulateContractErrorType>;

/** https://wagmi.sh/react/api/hooks/useSimulateContract */
export function injectSimulateContract<
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, 'nonpayable' | 'payable'>,
  args extends ContractFunctionArgs<abi, 'nonpayable' | 'payable', functionName>,
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] | undefined = undefined,
  selectData = SimulateContractData<abi, functionName, args, config, chainId>,
>(
  parametersFn: () => InjectSimulateContractParameters<
    abi,
    functionName,
    args,
    config,
    chainId,
    selectData
  > = emptyObjFn as any,
): InjectSimulateContractReturnType<abi, functionName, args, config, chainId, selectData> {
  const config = injectConfig();
  const configChainId = injectChainId();
  const { data: connectorClient } = injectConnectorClient(() => {
    const parameters = parametersFn();
    return {
      connector: parameters.connector,
      query: { enabled: parameters.account === undefined },
    };
  });
  const props = computed(() => {
    const parameters = parametersFn();
    const { abi, address, functionName, query = {} } = parameters;
    const chainId = parameters.chainId ?? configChainId();
    const options = simulateContractQueryOptions<config, abi, functionName, args, chainId>(config as config, {
      ...parameters,
      account: parameters.account ?? connectorClient()?.account,
      chainId,
    });
    const enabled = Boolean(abi && address && functionName && (query.enabled ?? true));
    return { ...queryOptionsSupportBigInt, ...query, ...options, enabled };
  });
  return injectQuery(props) as InjectSimulateContractReturnType<abi, functionName, args, config, chainId, selectData>;
}
