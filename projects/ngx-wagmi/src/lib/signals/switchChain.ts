import { computed } from '@angular/core';

import { injectMutation } from '@tanstack/angular-query-experimental';
import type {
  Config,
  ResolvedRegister,
  SwitchChainErrorType,
} from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import {
  type SwitchChainData,
  type SwitchChainMutate,
  type SwitchChainMutateAsync,
  switchChainMutationOptions,
  type SwitchChainVariables,
} from '@wagmi/core/query';

import type { ConfigParameter } from '../types/properties';
import {
  emptyObjFn,
  type InjectMutationParameters,
  type InjectMutationReturnType,
} from '../utils/query';
import { injectConfig } from './config';

export type InjectSwitchChainParameters<
  config extends Config = Config,
  context = unknown
> = Compute<
  ConfigParameter<config> & {
    mutation?:
      | InjectMutationParameters<
          SwitchChainData<config, config['chains'][number]['id']>,
          SwitchChainErrorType,
          SwitchChainVariables<config, config['chains'][number]['id']>,
          context
        >
      | undefined;
  }
>;

export type InjectSwitchChainReturnType<
  config extends Config = Config,
  context = unknown
> = Compute<
  InjectMutationReturnType<
    SwitchChainData<config, config['chains'][number]['id']>,
    SwitchChainErrorType,
    SwitchChainVariables<config, config['chains'][number]['id']>,
    context
  > & {
    switchChain: SwitchChainMutate<config, context>;
    switchChainAsync: SwitchChainMutateAsync<config, context>;
  }
>;

export function injectSwitchChain<
  config extends Config = ResolvedRegister['config'],
  context = unknown
>(
  parametersFn: () => InjectSwitchChainParameters<config, context> = emptyObjFn
): InjectSwitchChainReturnType<config, context> {
  const config = injectConfig();
  const props = computed(() => {
    const { mutation } = parametersFn();
    const mutationOptions = switchChainMutationOptions(config);
    return {
      ...mutation,
      ...mutationOptions,
    };
  });

  const { mutate, mutateAsync, ...result } = injectMutation(
    () =>
      props() as unknown as ReturnType<
        typeof switchChainMutationOptions<config>
      >
  );

  type Return = InjectSwitchChainReturnType<config, context>;
  return {
    ...result,
    switchChain: mutate as Return['switchChain'],
    switchChainAsync: mutateAsync as Return['switchChainAsync'],
  } as unknown as Return;
}
