import { effect, signal } from '@angular/core';

import { getConnections, type GetConnectionsReturnType, watchConnections } from '@wagmi/core';

import type { ConfigParameter } from '../types/properties';
import { injectConfig } from './config';

export type UseConnectionsParameters = ConfigParameter;

export type UseConnectionsReturnType = GetConnectionsReturnType;

export function injectConnections(parameters: UseConnectionsParameters = {}) {
  const config = injectConfig(parameters);
  const conns = signal(getConnections(config));
  effect((onClean) => onClean(watchConnections(config, { onChange: conns.set })), { allowSignalWrites: true });
  return conns.asReadonly();
}
