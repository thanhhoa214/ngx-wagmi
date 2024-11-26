import { injectMutation } from '@tanstack/angular-query-experimental';
import type { SignMessageErrorType } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import {
  type SignMessageData,
  type SignMessageMutate,
  type SignMessageMutateAsync,
  type SignMessageVariables,
  signMessageMutationOptions,
} from '@wagmi/core/query';

import { computed } from '@angular/core';
import type { ConfigParameter } from '../types/properties';
import type { InjectMutationParameters, InjectMutationReturnType } from '../utils/query';
import { emptyObjFn } from '../utils/query';
import { injectConfig } from './config';

export type InjectSignMessageParameters<context = unknown> = Compute<
  ConfigParameter & {
    mutation?:
      | InjectMutationParameters<SignMessageData, SignMessageErrorType, SignMessageVariables, context>
      | undefined;
  }
>;

export type InjectSignMessageReturnType<context = unknown> = Compute<
  InjectMutationReturnType<SignMessageData, SignMessageErrorType, SignMessageVariables, context> & {
    signMessage: SignMessageMutate<context>;
    signMessageAsync: SignMessageMutateAsync<context>;
  }
>;

export function injectSignMessage<context = unknown>(
  parametersFn: () => InjectSignMessageParameters<context> = emptyObjFn,
): InjectSignMessageReturnType<context> {
  const config = injectConfig();

  const props = computed(() => {
    const { mutation } = parametersFn();
    const mutationOptions = signMessageMutationOptions(config);
    return { ...mutation, ...mutationOptions };
  });

  const { mutate, mutateAsync, ...result } = injectMutation(props);

  return {
    ...result,
    signMessage: mutate,
    signMessageAsync: mutateAsync,
  };
}
