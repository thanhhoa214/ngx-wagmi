import { computed } from '@angular/core';

import { injectMutation } from '@tanstack/angular-query-experimental';
import type { ReconnectErrorType } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import {
  reconnectMutationOptions,
  type ReconnectData,
  type ReconnectMutate,
  type ReconnectMutateAsync,
  type ReconnectVariables,
} from '@wagmi/core/query';

import type { ConfigParameter } from '../types/properties';
import { emptyObjFn, type InjectMutationParameters, type InjectMutationReturnType } from '../utils/query';
import { injectConfig } from './config';

export type InjectReconnectParameters<context = unknown> = Compute<
  ConfigParameter & {
    mutation?: InjectMutationParameters<ReconnectData, ReconnectErrorType, ReconnectVariables, context> | undefined;
  }
>;

export type InjectReconnectReturnType<context = unknown> = Compute<
  InjectMutationReturnType<ReconnectData, ReconnectErrorType, ReconnectVariables, context> & {
    reconnect: ReconnectMutate<context>;
    reconnectAsync: ReconnectMutateAsync<context>;
  }
>;

export function injectReconnect<context = unknown>(
  parametersFn: () => InjectReconnectParameters<context> = emptyObjFn,
): InjectReconnectReturnType<context> {
  const config = injectConfig();
  const props = computed(() => {
    const { mutation } = parametersFn();
    const mutationOptions = reconnectMutationOptions(config);
    return { ...mutation, ...mutationOptions };
  });
  const { mutate, mutateAsync, ...result } = injectMutation(props);

  return {
    ...result,
    reconnect: mutate,
    reconnectAsync: mutateAsync,
  };
}
