import { injectMutation } from '@tanstack/angular-query-experimental';
import type { Config, DeployContractErrorType, ResolvedRegister } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import {
  type DeployContractData,
  type DeployContractMutate,
  type DeployContractMutateAsync,
  type DeployContractVariables,
  deployContractMutationOptions,
} from '@wagmi/core/query';
import type { Abi } from 'viem';

import { computed } from '@angular/core';
import { InjectMutationParameters, InjectMutationReturnType, emptyObjFn } from '../utils/query';
import { injectConfig } from './config';

export type InjectDeployContractParameters<config extends Config = Config, context = unknown> = Compute<{
  mutation?:
    | InjectMutationParameters<
        DeployContractData,
        DeployContractErrorType,
        DeployContractVariables<Abi, config, config['chains'][number]['id']>,
        context
      >
    | undefined;
}>;

export type InjectDeployContractReturnType<
  config extends Config = Config,
  context = unknown,
> = InjectMutationReturnType<
  DeployContractData,
  DeployContractErrorType,
  DeployContractVariables<Abi, config, config['chains'][number]['id']>,
  context
> & {
  deployContract: DeployContractMutate<config, context>;
  deployContractAsync: DeployContractMutateAsync<config, context>;
};

// TODO: Test this function
export function injectDeployContract<config extends Config = ResolvedRegister['config'], context = unknown>(
  parametersFn: () => InjectDeployContractParameters<config, context> = emptyObjFn,
) {
  const config = injectConfig();

  const props = computed(() => {
    const parameters = parametersFn();
    const { mutation } = parameters;
    const mutationOptions = deployContractMutationOptions(config);
    return {
      ...mutation,
      ...mutationOptions,
    } as ReturnType<typeof deployContractMutationOptions<config>>;
  });
  const { mutate, mutateAsync, ...result } = injectMutation(props);

  type Return = InjectDeployContractReturnType<config, context>;
  return {
    ...result,
    deployContract: mutate as Return['deployContract'],
    deployContractAsync: mutateAsync as Return['deployContractAsync'],
  } as InjectDeployContractReturnType<config, context>;
}
