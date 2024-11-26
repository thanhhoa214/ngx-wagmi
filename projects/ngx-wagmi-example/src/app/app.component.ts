import { Component, computed, signal } from '@angular/core';

import { injected } from '@wagmi/core';
import { Chain } from '@wagmi/core/chains';
import {
  injectAccount,
  injectAccountEffect,
  injectBalance,
  injectBlock,
  injectBlockTransactionCount,
  injectBytecode,
  injectChainId,
  injectChains,
  injectClient,
  injectConfig,
  injectConnect,
  injectConnectorClient,
  injectConnectors,
  injectDisconnect,
  injectEnsAddress,
  injectEnsAvatar,
  injectEnsName,
  injectEnsResolver,
  injectEnsText,
  injectEstimateFeesPerGas,
  injectEstimateGas,
  injectEstimateMaxPriorityFeePerGas,
  injectFeeHistory,
  injectReconnect,
  injectSwitchChain,
  injectWatchAsset,
  injectWatchBlockNumber,
  injectWatchBlocks,
} from 'ngx-wagmi';
import { CardComponent } from './ui/card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div>
      <p>
        Chain ID: {{ chainId() }}.

        @if (account().isConnected) {
          <button (click)="disconnectM.disconnect()">Disconnect</button>
          Account: {{ account().address }}
        } @else {
          <button (click)="connect.connect({ connector: injectedConnector })">Connect</button>
        }
      </p>

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

      <app-card title="Current block" [query]="block" />
      <app-card title="Current block tx count" [query]="blockTxCount" />
      <app-card title="Balance" [query]="balance" />
      <app-card title="Bytecode" [query]="bytecodeQ" />
      <app-card title="Connector Client" [query]="connectorClientQ" />
      <app-card title="ensAddress of vitalik" [query]="ensAddress" />
      <app-card title="ensName of vitalik" [query]="ensName" />
      <app-card title="ensAvatar of vitalik" [query]="ensAvatar" />
      <app-card title="ensResolver of vitalik" [query]="ensResolver" />
      <app-card title="ensText of vitalik" [query]="ensText" />
      <app-card title="feesPerGas" [query]="feesPerGas" />
      <app-card title="gas" [query]="gas" />
      <app-card title="maxPriorityFeePerGas" [query]="maxPriorityFeePerGas" />
      <app-card title="feeHistory" [query]="feeHistory" />
    </div>
  `,
  imports: [CardComponent],
})
export class AppComponent {
  private enabled = signal(true);
  private vitalik = signal({ address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' } as const);

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
  client = injectClient();
  connectorClientQ = injectConnectorClient();

  ensAddress = injectEnsAddress(() => ({ name: 'vitalik.eth' }));
  ensName = injectEnsName(() => ({ address: this.vitalik().address }));
  ensAvatar = injectEnsAvatar(() => ({
    name: this.ensName.data()!,
    query: { enabled: !!this.ensName.data() },
  }));
  ensText = injectEnsText(() => ({
    name: this.ensName.data()!,
    key: 'com.twitter',
    query: { enabled: !!this.ensName.data() },
  }));
  ensResolver = injectEnsResolver(() => ({
    name: this.ensName.data()!,
    query: { enabled: !!this.ensName.data() },
  }));

  feesPerGas = injectEstimateFeesPerGas();
  gas = injectEstimateGas();
  maxPriorityFeePerGas = injectEstimateMaxPriorityFeePerGas();
  feeHistory = injectFeeHistory(() => ({ blockCount: 4, rewardPercentiles: [25, 75] }));

  constructor() {
    this.reconnect.reconnect();
  }

  switchChain(chainId: Chain['id']) {
    this.switchChainM.switchChain({ chainId });
    this.enabled.set(!this.enabled());
  }
}
