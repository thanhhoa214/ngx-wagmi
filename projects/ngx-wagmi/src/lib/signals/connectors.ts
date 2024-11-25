import { effect, signal, Signal } from '@angular/core';

import { getConnectors, type GetConnectorsReturnType, watchConnectors } from '@wagmi/core';

import type { ConfigParameter } from '../types/properties';
import { injectConfig } from './config';

export type InjectConnectorsParameters = ConfigParameter;

export type InjectConnectorsReturnType = GetConnectorsReturnType;

export function injectConnectors(parameters: InjectConnectorsParameters = {}): Signal<InjectConnectorsReturnType> {
  const config = injectConfig(parameters);
  const connectors = signal<InjectConnectorsReturnType>(getConnectors(config));

  effect((onClean) =>
    onClean(
      watchConnectors(config, {
        onChange: (newConnectors) => connectors.set(newConnectors),
      }),
    ),
  );

  return connectors.asReadonly();
}
