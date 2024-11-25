import { effect } from '@angular/core';
import { type GetAccountReturnType, watchAccount } from '@wagmi/core';
import type { Compute } from '@wagmi/core/internal';
import type { ConfigParameter } from '../types/properties';
import { injectConfig } from './config';

export type InjectAccountEffectParameters = Compute<
  {
    onConnect?(
      data: Compute<
        Pick<
          Extract<GetAccountReturnType, { status: 'connected' }>,
          'address' | 'addresses' | 'chain' | 'chainId' | 'connector'
        > & {
          isReconnected: boolean;
        }
      >,
    ): void;
    onDisconnect?(): void;
  } & ConfigParameter
>;

export function injectAccountEffect(parameters: InjectAccountEffectParameters = {}) {
  const { onConnect, onDisconnect } = parameters;
  const config = injectConfig(parameters);

  effect((onClean) => {
    return onClean(
      watchAccount(config, {
        onChange(data, prevData) {
          if (
            (prevData.status === 'reconnecting' ||
              (prevData.status === 'connecting' && prevData.address === undefined)) &&
            data.status === 'connected'
          ) {
            const { address, addresses, chain, chainId, connector } = data;
            const isReconnected =
              prevData.status === 'reconnecting' ||
              // if `previousAccount.status` is `undefined`, the connector connected immediately.
              prevData.status === undefined;
            onConnect?.({
              address,
              addresses,
              chain,
              chainId,
              connector,
              isReconnected,
            });
          } else if (prevData.status === 'connected' && data.status === 'disconnected') onDisconnect?.();
        },
      }),
    );
  });
}
