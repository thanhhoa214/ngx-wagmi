import { effect, signal, Signal } from '@angular/core';
import { type Config, getChainId, type GetChainIdReturnType, type ResolvedRegister, watchChainId } from '@wagmi/core';
import { injectConfig } from './config';

export type InjectChainIdReturnType<config extends Config = Config> = GetChainIdReturnType<config>;

export function injectChainId<config extends Config = ResolvedRegister['config']>(): Signal<
  InjectChainIdReturnType<config>
> {
  const config = injectConfig();
  const chainId = signal(getChainId(config));
  effect((onClean) => onClean(watchChainId(config, { onChange: chainId.set })), { allowSignalWrites: true });
  return chainId.asReadonly();
}
