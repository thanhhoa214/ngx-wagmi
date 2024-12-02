import { createNoopInjectionToken } from 'ngxtension/create-injection-token';

export interface InjectConfigParameters {
  initialChainId?: number;
}

const [injectFn, provideConfig, SEEDKIT_CONFIG] = createNoopInjectionToken<InjectConfigParameters>('SEEDKIT_CONFIG');

function injectConfig() {
  const config = injectFn();
  if (!config) throw new Error('You must `injectConfig` before using ngx-wagmi');
  return config;
}

export { injectConfig, provideConfig as provideSeedkitConfig, SEEDKIT_CONFIG };
