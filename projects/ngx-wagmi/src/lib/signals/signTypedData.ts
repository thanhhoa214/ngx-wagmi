import { injectMutation } from '@tanstack/angular-query-experimental';
import type { SignTypedDataErrorType } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import {
  type SignTypedDataData,
  type SignTypedDataMutate,
  type SignTypedDataMutateAsync,
  type SignTypedDataVariables,
  signTypedDataMutationOptions,
} from '@wagmi/core/query';

import { computed } from '@angular/core';
import type { ConfigParameter } from '../types/properties';
import type { InjectMutationParameters, InjectMutationReturnType } from '../utils/query';
import { emptyObjFn } from '../utils/query';
import { injectConfig } from './config';

export type InjectSignTypedDataParameters<context = unknown> = Compute<
  ConfigParameter & {
    mutation?:
      | InjectMutationParameters<SignTypedDataData, SignTypedDataErrorType, SignTypedDataVariables, context>
      | undefined;
  }
>;

export type InjectSignTypedDataReturnType<context = unknown> = Compute<
  InjectMutationReturnType<SignTypedDataData, SignTypedDataErrorType, SignTypedDataVariables, context> & {
    signTypedData: SignTypedDataMutate<context>;
    signTypedDataAsync: SignTypedDataMutateAsync<context>;
  }
>;

export function injectSignTypedData<context = unknown>(
  parametersFn: () => InjectSignTypedDataParameters<context> = emptyObjFn,
): InjectSignTypedDataReturnType<context> {
  const config = injectConfig();

  const props = computed(() => {
    const { mutation } = parametersFn();
    const mutationOptions = signTypedDataMutationOptions(config);
    return {
      ...mutation,
      ...mutationOptions,
    };
  });

  const { mutate, mutateAsync, ...result } = injectMutation(props);

  type Return = InjectSignTypedDataReturnType<context>;
  return {
    ...result,
    signTypedData: mutate as Return['signTypedData'],
    signTypedDataAsync: mutateAsync as Return['signTypedDataAsync'],
  };
}
