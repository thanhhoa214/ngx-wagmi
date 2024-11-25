import {
  injectMutation,
  mutationOptions,
} from '@tanstack/angular-query-experimental';
import type { ReconnectErrorType } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import {
  type ReconnectData,
  type ReconnectMutate,
  type ReconnectMutateAsync,
  reconnectMutationOptions,
  type ReconnectVariables,
} from '@wagmi/core/query';

import type { ConfigParameter } from '../types/properties.js';
import type {
  InjectMutationParameters,
  InjectMutationReturnType,
} from '../utils/query.js';
import { injectConfig } from './config';

('inject client');

export type InjectReconnectParameters<context = unknown> = Compute<
  ConfigParameter & {
    mutation?:
      | InjectMutationParameters<
          ReconnectData,
          ReconnectErrorType,
          ReconnectVariables,
          context
        >
      | undefined;
  }
>;

export type InjectReconnectReturnType<context = unknown> = Compute<
  InjectMutationReturnType<
    ReconnectData,
    ReconnectErrorType,
    ReconnectVariables,
    context
  > & {
    reconnect: ReconnectMutate<context>;
    reconnectAsync: ReconnectMutateAsync<context>;
  }
>;

export function injectReconnect<context = unknown>(
  parameters: InjectReconnectParameters<context> = {}
): InjectReconnectReturnType<context> {
  const { mutation } = parameters;

  const config = injectConfig(parameters);

  const extendMutationOptions = mutationOptions({
    ...mutation,
    ...reconnectMutationOptions(config),
  });
  const { mutate, mutateAsync, ...result } = injectMutation(
    () => extendMutationOptions
  );

  return {
    ...result,
    reconnect: mutate,
    reconnectAsync: mutateAsync,
  };
}
