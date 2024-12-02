import type { Config, createConfig, ResolvedRegister } from '@wagmi/core';
import { createNoopInjectionToken } from 'ngxtension/create-injection-token';
import type { ConfigParameter } from '../types/properties';

export type InjectConfigParameters<config extends Config = Config> = ConfigParameter<config>;
export type InjectConfigReturnType<config extends Config = Config> = config;

const [injectFn, provideConfig, WAGMI_CONFIG] =
  createNoopInjectionToken<ReturnType<typeof createConfig>>('WAGMI_CONFIG');

function injectConfig<config extends Config = ResolvedRegister['config']>(
  parameters: InjectConfigParameters<config> = {},
): InjectConfigReturnType<config> {
  const config = parameters.config ?? injectFn();
  if (!config) throw new Error('You must `injectConfig` before using ngx-wagmi');
  return config as InjectConfigReturnType<config>;
}

export { injectConfig, provideConfig as provideWagmiConfig, WAGMI_CONFIG };
