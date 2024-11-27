import { type Config, type ResolvedRegister, type WatchContractEventParameters, watchContractEvent } from '@wagmi/core';
import type { Abi, ContractEventName } from 'viem';

import { computed, effect } from '@angular/core';
import type { EnabledParameter } from '../types/properties';
import { emptyObjFn } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectWatchContractEventParameters<
  abi extends Abi | readonly unknown[] = Abi,
  eventName extends ContractEventName<abi> = ContractEventName<abi>,
  strict extends boolean | undefined = undefined,
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
> = WatchContractEventParameters<abi, eventName, strict, config, chainId> & EnabledParameter;

export type InjectWatchContractEventReturnType = void;

/** https://wagmi.sh/react/api/hooks/useWatchContractEvent */
export function injectWatchContractEvent<
  const abi extends Abi | readonly unknown[],
  eventName extends ContractEventName<abi>,
  strict extends boolean | undefined = undefined,
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
>(
  parametersFn: () => InjectWatchContractEventParameters<abi, eventName, strict, config, chainId> = emptyObjFn as any,
): InjectWatchContractEventReturnType {
  const config = injectConfig();
  const configChainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { enabled = true, ...rest } = parameters;
    const chainId = parameters.chainId ?? configChainId();
    return { enabled, ...rest, chainId };
  });

  effect((onClean) => {
    const { enabled, chainId, onLogs, ...rest } = props();
    if (!enabled) return;
    if (!onLogs) return;
    return onClean(
      watchContractEvent(config, {
        ...(rest as any),
        chainId,
        onLogs,
      }),
    );
  });
}
