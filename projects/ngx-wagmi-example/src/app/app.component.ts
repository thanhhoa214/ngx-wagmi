import { Component, computed, signal } from '@angular/core';

import {
  injectAccount,
  injectAccountEffect,
  injectBalance,
  injectChainId,
  injectChains,
  injectConfig,
  injectConnect,
  injectConnectors,
  injectDisconnect,
  injectReconnect,
  injectSwitchChain,
  injectWatchBlocks,
} from 'ngx-wagmi';

import { injected } from '@wagmi/core';
import { Chain } from '@wagmi/core/chains';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <ul>
      <li>Account: {{ account().address }}</li>
      <li>Chain ID: {{ chainId() }}</li>
      <!-- <li>Current block: {{ block.data()?.number }}</li> -->
      <li>
        Balance: {{ balance.data()?.symbol }}{{ balance.data()?.value }}, {{ balance.isLoading() }},
        {{ balance.error() }}
      </li>
    </ul>

    <br />
    <h3>Connection</h3>
    @for (item of connectors(); track item.id) {
      <button (click)="item.connect()">Connect to {{ item.id }}</button>
    }
    <br />
    <button (click)="connect.connect({ connector: injectedConnector })">Connect</button>
    <button (click)="disconnectM.disconnect()">Disconnect</button>

    <br />
    <h3>Switch Chain</h3>
    <ul>
      @for (item of chains(); track item.id) {
        <li>
          <button (click)="switchChain(item.id)">Switch to {{ item.name }}</button>
        </li>
      }
    </ul>
  `,
})
export class AppComponent {
  enabled = signal(true);

  account = injectAccount();
  chainId = injectChainId();
  address = computed(() => this.account().address);
  config = injectConfig();

  balance = injectBalance(() => ({
    address: this.address(),
    chainId: this.chainId(),
  }));
  _accountEffect = injectAccountEffect({
    onConnect: () => console.log('connected'),
    onDisconnect: () => console.log('disconnected'),
  });
  connectors = injectConnectors();
  connect = injectConnect();
  disconnectM = injectDisconnect();
  reconnect = injectReconnect();

  watchBlocks = injectWatchBlocks(() => ({
    onBlock: (block) => console.log(block.number),
  }));

  // block = injectBlock();

  readonly injectedConnector = injected();

  chains = injectChains();
  switchChainM = injectSwitchChain();

  constructor() {
    this.reconnect.reconnect();
  }

  switchChain(chainId: Chain['id']) {
    this.switchChainM.switchChain({ chainId });
    this.enabled.set(!this.enabled());
  }
}
