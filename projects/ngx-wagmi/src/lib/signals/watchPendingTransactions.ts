import { computed, effect } from '@angular/core';
import {
  type Config,
  type ResolvedRegister,
  type WatchPendingTransactionsParameters,
  watchPendingTransactions,
} from '@wagmi/core';
import type { UnionCompute, UnionExactPartial } from '@wagmi/core/internal';
import type { ConfigParameter, EnabledParameter } from '../types/properties';
import { emptyObjFn } from '../utils/query';
import { injectChainId } from './chainId';
import { injectConfig } from './config';

export type InjectWatchPendingTransactionsParameters<
  config extends Config = Config,
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
> = UnionCompute<
  UnionExactPartial<WatchPendingTransactionsParameters<config, chainId>> & ConfigParameter<config> & EnabledParameter
>;

export type InjectWatchPendingTransactionsReturnType = void;

/** https://wagmi.sh/react/api/hooks/useWatchPendingTransactions */
export function injectWatchPendingTransactions<
  config extends Config = ResolvedRegister['config'],
  chainId extends config['chains'][number]['id'] = config['chains'][number]['id'],
>(
  parametersFn: () => InjectWatchPendingTransactionsParameters<config, chainId> = emptyObjFn as any,
): InjectWatchPendingTransactionsReturnType {
  const config = injectConfig();
  const configChainId = injectChainId();

  const props = computed(() => {
    const parameters = parametersFn();
    const { enabled = true, onTransactions, config: _, ...rest } = parameters;
    const chainId = parameters.chainId ?? configChainId();
    return { enabled, onTransactions, ...rest, chainId };
  });

  effect((onClean) => {
    const { enabled, onTransactions, ...rest } = props();
    if (!enabled) return;
    if (!onTransactions) return;
    return onClean(
      watchPendingTransactions(config, {
        ...(rest as any),
        onTransactions,
      }),
    );
  });
}
