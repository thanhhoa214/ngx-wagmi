import { injectMutation } from '@tanstack/angular-query-experimental';
import type { Config, Connector, ResolvedRegister, SwitchAccountErrorType } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import {
  type SwitchAccountData,
  type SwitchAccountMutate,
  type SwitchAccountMutateAsync,
  type SwitchAccountVariables,
  switchAccountMutationOptions,
} from '@wagmi/core/query';

import { computed } from '@angular/core';
import type { ConfigParameter } from '../types/properties';
import type { InjectMutationParameters, InjectMutationReturnType } from '../utils/query';
import { emptyObjFn } from '../utils/query';
import { injectConfig } from './config';

export type InjectSwitchAccountParameters<config extends Config = Config, context = unknown> = Compute<
  ConfigParameter<config> & {
    mutation?:
      | InjectMutationParameters<SwitchAccountData<config>, SwitchAccountErrorType, SwitchAccountVariables, context>
      | undefined;
  }
>;

export type InjectSwitchAccountReturnType<config extends Config = Config, context = unknown> = Compute<
  InjectMutationReturnType<SwitchAccountData<config>, SwitchAccountErrorType, SwitchAccountVariables, context> & {
    connectors: readonly Connector[];
    switchAccount: SwitchAccountMutate<config, context>;
    switchAccountAsync: SwitchAccountMutateAsync<config, context>;
  }
>;

/** https://wagmi.sh/react/api/hooks/useSwitchAccount */
export function injectSwitchAccount<config extends Config = ResolvedRegister['config'], context = unknown>(
  parametersFn: () => InjectSwitchAccountParameters<config, context> = emptyObjFn,
): InjectSwitchAccountReturnType<config, context> {
  const config = injectConfig();

  const props = computed(() => {
    const { mutation } = parametersFn();
    const mutationOptions = switchAccountMutationOptions(config);
    return {
      ...mutation,
      ...mutationOptions,
    };
  });

  const { mutate, mutateAsync, ...result } = injectMutation(props);

  return {
    ...result,
    switchAccount: mutate,
    switchAccountAsync: mutateAsync,
  } as InjectSwitchAccountReturnType<config, context>;
}
