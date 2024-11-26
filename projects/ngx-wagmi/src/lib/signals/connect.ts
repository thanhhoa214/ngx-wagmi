import { effect } from '@angular/core';

import { injectMutation, mutationOptions } from '@tanstack/angular-query-experimental';
import type { Config, ConnectErrorType, ResolvedRegister } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import {
  connectMutationOptions,
  type ConnectData,
  type ConnectMutate,
  type ConnectMutateAsync,
  type ConnectVariables,
} from '@wagmi/core/query';

import { type InjectMutationParameters, type InjectMutationReturnType } from '../utils/query';
import { injectConfig } from './config';

export type InjectConnectParameters<config extends Config = Config, context = unknown> = Compute<{
  mutation?:
    | InjectMutationParameters<ConnectData<config>, ConnectErrorType, ConnectVariables<config>, context>
    | undefined;
}>;

export type InjectConnectReturnType<config extends Config = Config, context = unknown> = Compute<
  InjectMutationReturnType<ConnectData<config>, ConnectErrorType, ConnectVariables<config>, context> & {
    connect: ConnectMutate<config, context>;
    connectAsync: ConnectMutateAsync<config, context>;
  }
>;
export function injectConnect<config extends Config = ResolvedRegister['config'], context = unknown>(
  parameters: InjectConnectParameters<config, context> = {},
): InjectConnectReturnType<config, context> {
  const { mutation } = parameters;
  const config = injectConfig();
  const extendMutationOptions = mutationOptions({
    ...mutation,
    ...connectMutationOptions(config),
  });
  const { mutate, mutateAsync, ...result } = injectMutation(() => extendMutationOptions);

  // Reset mutation back to an idle state when the connector disconnects.
  effect((onClean) =>
    onClean(
      config.subscribe(
        ({ status }) => status,
        (status, previousStatus) => {
          if (previousStatus === 'connected' && status === 'disconnected') result.reset();
        },
      ),
    ),
  );

  return {
    ...result,
    connect: mutate,
    connectAsync: mutateAsync,
  };
}
