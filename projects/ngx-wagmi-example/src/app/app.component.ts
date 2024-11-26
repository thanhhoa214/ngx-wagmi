import { Component, computed, signal } from '@angular/core';

import {
  injectAccount,
  injectAccountEffect,
  injectBalance,
  injectBlock,
  injectBlockTransactionCount,
  injectBytecode,
  injectChainId,
  injectChains,
  injectConfig,
  injectConnect,
  injectConnectors,
  injectDisconnect,
  injectReconnect,
  injectSwitchChain,
  injectWatchAsset,
  injectWatchBlockNumber,
  injectWatchBlocks,
} from 'ngx-wagmi';

import { injected } from '@wagmi/core';
import { Chain } from '@wagmi/core/chains';
import { CardComponent } from './ui/card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <ul>
      <li>
        @if (account().isConnected) {
          <button (click)="disconnectM.disconnect()">Disconnect</button>
          Account: {{ account().address }}
        } @else {
          <button (click)="connect.connect({ connector: injectedConnector })">Connect</button>
        }
      </li>
      <li>Chain ID: {{ chainId() }}</li>
      <app-card title="Current block" [query]="block" />
      <app-card title="Current block tx count" [query]="blockTxCount" />
      <app-card title="Balance" [query]="balance" />
      <app-card title="Bytecode" [query]="bytecodeQ" />
    </ul>

    <br />
    <h3>Connections</h3>
    @for (item of connectors(); track item.id) {
      <button (click)="item.connect()">Connect to {{ item.id }}</button>
    }
    <br />
    <h3>Switch Chain</h3>
    <ul>
      @for (item of chains(); track item.id) {
        <li>
          <button (click)="switchChain(item.id)">Switch to {{ item.name }}</button>
        </li>
      }
    </ul>

    <h3>Add USDT to wallet for watching (watchAsset)</h3>
    <button
      (click)="
        watchAssetM.watchAssetAsync({
          type: 'ERC20',
          options: {
            address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            symbol: 'USDT',
            decimals: 6,
          },
        })
      ">
      Watch USDT
    </button>
    <p>{{ watchAssetM.error()?.message }}</p>
  `,
  imports: [CardComponent],
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
    onBlock: (block) => console.log('block.number', block.number),
  }));

  block = injectBlock(() => ({ watch: true }));
  watchBlockNumber = injectWatchBlockNumber(() => ({
    onBlockNumber: (blockNumber) => console.log('blockNumber', blockNumber),
  }));

  readonly injectedConnector = injected();

  chains = injectChains();
  switchChainM = injectSwitchChain();

  watchAssetM = injectWatchAsset();
  blockTxCount = injectBlockTransactionCount(() => ({
    blockNumber: this.block.data()?.number,
  }));

  bytecodeQ = injectBytecode(() => ({ address: this.address() }));

  constructor() {
    this.reconnect.reconnect();
  }

  switchChain(chainId: Chain['id']) {
    this.switchChainM.switchChain({ chainId });
    this.enabled.set(!this.enabled());
  }
}
