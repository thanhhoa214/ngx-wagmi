import { injectMutation } from '@tanstack/angular-query-experimental';
import type { Config, ResolvedRegister, WriteContractErrorType } from '@wagmi/core';
import {
  type WriteContractData,
  type WriteContractMutate,
  type WriteContractMutateAsync,
  type WriteContractVariables,
  writeContractMutationOptions,
} from '@wagmi/core/query';
import type { Abi } from 'viem';

import { computed } from '@angular/core';
import type { ConfigParameter } from '../types/properties';
import type { InjectMutationParameters, InjectMutationReturnType } from '../utils/query';
import { emptyObjFn } from '../utils/query';
import { injectConfig } from './config';

export type InjectWriteContractParameters<
  config extends Config = Config,
  context = unknown,
> = ConfigParameter<config> & {
  mutation?:
    | InjectMutationParameters<
        WriteContractData,
        WriteContractErrorType,
        WriteContractVariables<Abi, string, readonly unknown[], config, config['chains'][number]['id']>,
        context
      >
    | undefined;
};

export type InjectWriteContractReturnType<config extends Config = Config, context = unknown> = InjectMutationReturnType<
  WriteContractData,
  WriteContractErrorType,
  WriteContractVariables<Abi, string, readonly unknown[], config, config['chains'][number]['id']>,
  context
> & {
  writeContract: WriteContractMutate<config, context>;
  writeContractAsync: WriteContractMutateAsync<config, context>;
};

/** https://wagmi.sh/react/api/hooks/useWriteContract */
export function injectWriteContract<config extends Config = ResolvedRegister['config'], context = unknown>(
  parametersFn: () => InjectWriteContractParameters<config, context> = emptyObjFn,
): InjectWriteContractReturnType<config, context> {
  const config = injectConfig();

  const props = computed(() => {
    const parameters = parametersFn();
    const { mutation } = parameters;
    const mutationOptions = writeContractMutationOptions(config);
    return {
      ...mutation,
      ...mutationOptions,
    } as InjectMutationParameters<
      WriteContractData,
      WriteContractErrorType,
      WriteContractVariables<Abi, string, readonly unknown[], config, config['chains'][number]['id']>,
      context
    >;
  });

  const { mutate, mutateAsync, ...result } = injectMutation(props);

  type Return = InjectWriteContractReturnType<config, context>;
  return {
    ...result,
    writeContract: mutate as Return['writeContract'],
    writeContractAsync: mutateAsync as Return['writeContractAsync'],
  } as unknown as InjectWriteContractReturnType<config, context>;
}
