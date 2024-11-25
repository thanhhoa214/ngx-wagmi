import { computed } from '@angular/core';

import { injectMutation } from '@tanstack/angular-query-experimental';
import type { DisconnectErrorType } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import {
  type DisconnectData,
  type DisconnectMutate,
  type DisconnectMutateAsync,
  disconnectMutationOptions,
  type DisconnectVariables,
} from '@wagmi/core/query';

import type { ConfigParameter } from '../types/properties';
import { emptyObjFn, type InjectMutationParameters, type InjectMutationReturnType } from '../utils/query';
import { injectConfig } from './config';

export type InjectDisconnectParameters<context = unknown> = Compute<
  ConfigParameter & {
    mutation?: InjectMutationParameters<DisconnectData, DisconnectErrorType, DisconnectVariables, context> | undefined;
  }
>;

export type InjectDisconnectReturnType<context = unknown> = Compute<
  InjectMutationReturnType<DisconnectData, DisconnectErrorType, DisconnectVariables, context> & {
    disconnect: DisconnectMutate<context>;
    disconnectAsync: DisconnectMutateAsync<context>;
  }
>;

export function injectDisconnect<context = unknown>(
  parametersFn: () => InjectDisconnectParameters<context> = emptyObjFn,
): InjectDisconnectReturnType<context> {
  const config = injectConfig();
  const props = computed(() => {
    const { mutation } = parametersFn();
    const mutationOptions = disconnectMutationOptions(config);
    return {
      ...mutation,
      ...mutationOptions,
    };
  });
  const { mutate, mutateAsync, ...result } = injectMutation(props);

  return {
    ...result,
    disconnect: mutate,
    disconnectAsync: mutateAsync,
  };
}
