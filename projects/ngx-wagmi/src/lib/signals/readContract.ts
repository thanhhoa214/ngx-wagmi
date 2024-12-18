import type { Config, ReadContractErrorType, ResolvedRegister } from '@wagmi/core';
import type { UnionCompute } from '@wagmi/core/internal';
import {
  type ReadContractData,
  type ReadContractOptions,
  type ReadContractQueryFnData,
  type ReadContractQueryKey,
  readContractQueryOptions,
  structuralSharing,
} from '@wagmi/core/query';
import type { Abi, ContractFunctionArgs, ContractFunctionName, Hex } from 'viem';

import { computed } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import type { ConfigParameter, QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn, queryOptionsSupportBigInt } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectReadContractParameters<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<abi, 'pure' | 'view'> = ContractFunctionName<abi, 'pure' | 'view'>,
  args extends ContractFunctionArgs<abi, 'pure' | 'view', functionName> = ContractFunctionArgs<
    abi,
    'pure' | 'view',
    functionName
  >,
  config extends Config = Config,
  selectData = ReadContractData<abi, functionName, args>,
> = UnionCompute<
  ReadContractOptions<abi, functionName, args, config> &
    ConfigParameter<config> &
    QueryParameter<
      ReadContractQueryFnData<abi, functionName, args>,
      ReadContractErrorType,
      selectData,
      ReadContractQueryKey<abi, functionName, args, config>
    >
>;

export type InjectReadContractReturnType<
  abi extends Abi | readonly unknown[] = Abi,
  functionName extends ContractFunctionName<abi, 'pure' | 'view'> = ContractFunctionName<abi, 'pure' | 'view'>,
  args extends ContractFunctionArgs<abi, 'pure' | 'view', functionName> = ContractFunctionArgs<
    abi,
    'pure' | 'view',
    functionName
  >,
  selectData = ReadContractData<abi, functionName, args>,
> = InjectQueryReturnType<selectData, ReadContractErrorType>;

export function injectReadContract<
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, 'pure' | 'view'>,
  args extends ContractFunctionArgs<abi, 'pure' | 'view', functionName>,
  config extends Config = ResolvedRegister['config'],
  selectData = ReadContractData<abi, functionName, args>,
>(
  parametersFn: () => InjectReadContractParameters<abi, functionName, args, config, selectData> = emptyObjFn as any,
): InjectReadContractReturnType<abi, functionName, args, selectData> {
  const config = injectConfig();
  const configChainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { abi, address, functionName, query = {} } = parameters;
    // @ts-ignore
    const code = parameters.code as Hex | undefined;
    const chainId = parameters.chainId ?? configChainId();

    const options = readContractQueryOptions<config, abi, functionName, args>(config as config, {
      ...(parameters as any),
      chainId,
    });
    const enabled = Boolean((address || code) && abi && functionName && (query.enabled ?? true));
    return {
      ...queryOptionsSupportBigInt,
      ...query,
      ...options,
      enabled,
      structuralSharing: query.structuralSharing ?? structuralSharing,
    };
  });

  return injectQuery(props) as InjectReadContractReturnType<abi, functionName, args, selectData>;
}
