import { injectQuery } from '@tanstack/angular-query-experimental';
import type { Config, ReadContractsErrorType, ResolvedRegister } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import {
  type ReadContractsData,
  type ReadContractsOptions,
  type ReadContractsQueryFnData,
  type ReadContractsQueryKey,
  readContractsQueryOptions,
  structuralSharing,
} from '@wagmi/core/query';
import type { ContractFunctionParameters } from 'viem';

import { computed } from '@angular/core';
import type { ConfigParameter, QueryParameter } from '../types/properties';
import { type InjectQueryReturnType, emptyObjFn, queryOptionsSupportBigInt } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectReadContractsParameters<
  contracts extends readonly unknown[] = readonly ContractFunctionParameters[],
  allowFailure extends boolean = true,
  config extends Config = Config,
  selectData = ReadContractsData<contracts, allowFailure>,
> = Compute<
  ReadContractsOptions<contracts, allowFailure, config> &
    ConfigParameter<config> &
    QueryParameter<
      ReadContractsQueryFnData<contracts, allowFailure>,
      ReadContractsErrorType,
      selectData,
      ReadContractsQueryKey<contracts, allowFailure, config>
    >
>;

export type InjectReadContractsReturnType<
  contracts extends readonly unknown[] = readonly ContractFunctionParameters[],
  allowFailure extends boolean = true,
  selectData = ReadContractsData<contracts, allowFailure>,
> = InjectQueryReturnType<selectData, ReadContractsErrorType>;

/** https://wagmi.sh/react/api/hooks/useReadContracts */
export function injectReadContracts<
  const contracts extends readonly unknown[],
  allowFailure extends boolean = true,
  config extends Config = ResolvedRegister['config'],
  selectData = ReadContractsData<contracts, allowFailure>,
>(parametersFn: () => InjectReadContractsParameters<contracts, allowFailure, config, selectData> = emptyObjFn) {
  const config = injectConfig();
  const chainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { contracts = [], query = {} } = parameters;
    const options = readContractsQueryOptions<config, contracts, allowFailure>(config as config, {
      ...parameters,
      chainId: chainId(),
    });
    let isContractsValid = false;
    for (const contract of contracts) {
      const { abi, address, functionName } = contract as ContractFunctionParameters;
      if (!abi || !address || !functionName) {
        isContractsValid = false;
        break;
      }
      isContractsValid = true;
    }
    const enabled = Boolean(isContractsValid && (query.enabled ?? true));
    return {
      ...queryOptionsSupportBigInt,
      ...options,
      ...query,
      enabled,
      structuralSharing: query.structuralSharing ?? structuralSharing,
    };
  });

  return injectQuery(props) as InjectReadContractsReturnType<contracts, allowFailure, selectData>;
}
