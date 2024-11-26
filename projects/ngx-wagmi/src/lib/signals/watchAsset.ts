import { injectMutation } from '@tanstack/angular-query-experimental';
import type { WatchAssetErrorType } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import {
  watchAssetMutationOptions,
  type WatchAssetData,
  type WatchAssetMutate,
  type WatchAssetMutateAsync,
  type WatchAssetVariables,
} from '@wagmi/core/query';

import { computed } from '@angular/core';
import { emptyObjFn, type InjectMutationParameters, type InjectMutationReturnType } from '../utils/query';
import { injectConfig } from './config';

export type InjectWatchAssetParameters<context = unknown> = Compute<{
  mutation?: InjectMutationParameters<WatchAssetData, WatchAssetErrorType, WatchAssetVariables, context> | undefined;
}>;

export type InjectWatchAssetReturnType<context = unknown> = Compute<
  InjectMutationReturnType<WatchAssetData, WatchAssetErrorType, WatchAssetVariables, context> & {
    watchAsset: WatchAssetMutate<context>;
    watchAssetAsync: WatchAssetMutateAsync<context>;
  }
>;

export function injectWatchAsset<context = unknown>(
  parametersFn: () => InjectWatchAssetParameters<context> = emptyObjFn,
): InjectWatchAssetReturnType<context> {
  const config = injectConfig();

  const props = computed(() => {
    const parameters = parametersFn();
    const { mutation } = parameters;
    const mutationOptions = watchAssetMutationOptions(config);
    return {
      ...mutation,
      ...mutationOptions,
    };
  });

  const { mutate, mutateAsync, ...result } = injectMutation(props);

  return {
    ...result,
    watchAsset: mutate,
    watchAssetAsync: mutateAsync,
  };
}
