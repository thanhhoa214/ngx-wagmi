import { injectMutation } from '@tanstack/angular-query-experimental';
import type { Config, ResolvedRegister, SendTransactionErrorType } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import {
  type SendTransactionData,
  type SendTransactionMutate,
  type SendTransactionMutateAsync,
  type SendTransactionVariables,
  sendTransactionMutationOptions,
} from '@wagmi/core/query';

import { computed } from '@angular/core';
import type { ConfigParameter } from '../types/properties';
import { InjectMutationParameters, InjectMutationReturnType, emptyObjFn } from '../utils/query';
import { injectConfig } from './config';

export type InjectSendTransactionParameters<config extends Config = Config, context = unknown> = Compute<
  ConfigParameter<config> & {
    mutation?:
      | InjectMutationParameters<
          SendTransactionData,
          SendTransactionErrorType,
          SendTransactionVariables<config, config['chains'][number]['id']>,
          context
        >
      | undefined;
  }
>;

export type InjectSendTransactionReturnType<config extends Config = Config, context = unknown> = Compute<
  InjectMutationReturnType<
    SendTransactionData,
    SendTransactionErrorType,
    SendTransactionVariables<config, config['chains'][number]['id']>,
    context
  > & {
    sendTransaction: SendTransactionMutate<config, context>;
    sendTransactionAsync: SendTransactionMutateAsync<config, context>;
  }
>;

export function injectSendTransaction<config extends Config = ResolvedRegister['config'], context = unknown>(
  parametersFn: () => InjectSendTransactionParameters<config, context> = emptyObjFn,
): InjectSendTransactionReturnType<config, context> {
  const config = injectConfig();

  const props = computed(() => {
    const { mutation } = parametersFn();
    const mutationOptions = sendTransactionMutationOptions(config);
    return { ...mutation, ...mutationOptions } as InjectMutationParameters<
      SendTransactionData,
      SendTransactionErrorType,
      SendTransactionVariables<config, config['chains'][number]['id']>,
      context
    >;
  });

  const { mutate, mutateAsync, ...result } = injectMutation(props);

  type Return = InjectSendTransactionReturnType<config, context>;
  return {
    ...result,
    sendTransaction: mutate as Return['sendTransaction'],
    sendTransactionAsync: mutateAsync as Return['sendTransactionAsync'],
  } as unknown as Return;
}
