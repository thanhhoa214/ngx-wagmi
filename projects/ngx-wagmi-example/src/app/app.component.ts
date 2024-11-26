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
  injectGasPrice,
  injectPrepareTransactionRequest,
  injectProof,
  injectPublicClient,
  injectReadContract,
  injectReadContracts,
  injectReconnect,
  injectSendTransaction,
  injectSignMessage,
  injectSwitchChain,
  injectWatchAsset,
  injectWatchBlockNumber,
  injectWatchBlocks,
} from 'ngx-wagmi';
import { Address, erc20Abi, parseEther } from 'viem';
import { CardComponent } from './ui/card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div>
      <div class="space-x-2">
        Chain ID: {{ chainId() }}.

        @if (account().isConnected) {
          <button (click)="disconnectM.disconnect()">Disconnect</button>
          Account: {{ account().address }}
        } @else {
          <button (click)="connect.connect({ connector: injectedConnector })">Connect</button>
        }
      </div>

      <div class="space-x-2">
        <strong>Connections</strong>
        @for (item of connectors(); track item.id) {
          <button (click)="item.connect()">Connect to {{ item.id }}</button>
        }
      </div>

      <div class="space-x-2">
        <strong>Switch Chain</strong>
        @for (item of chains(); track item.id) {
          <button (click)="switchChain(item.id)">Switch to {{ item.name }}</button>
        }
      </div>

      <p class="error">
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
          Add USDT to wallet for watching (watchAsset)
        </button>
        {{ watchAssetM.error()?.message }}
      </p>

      <p class="error">
        <button (click)="sendTx()">Send transaction</button>
        {{ sendTxM.error()?.message }}
      </p>

      <p class="error">
        <button (click)="signMessage()">Sign message</button>
        {{ signMessageM.error()?.message }}
      </p>

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
      <app-card title="gasPrice" [query]="gasPrice" />
      <app-card title="proof" [query]="proof" />
      <app-card title="preparedTxRequest" [query]="preparedTxRequest" />
      <app-card title="usdtName" [query]="usdtName" />
      <app-card title="usdtInfo" [query]="usdtInfo">
        <button (click)="usdtEthAddress.set('0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9')">Fetch AAVE info</button>
      </app-card>
    </div>
  `,
  imports: [CardComponent],
})
export class AppComponent {
  private enabled = signal(true);
  private vitalik = signal({ address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' } as const);
  usdtEthAddress = signal<Address>('0xdac17f958d2ee523a2206206994597c13d831ec7');

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
  private client = injectClient();
  private publicClient = injectPublicClient();
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
  gasPrice = injectGasPrice();

  proof = injectProof(() => ({
    address: '0x4200000000000000000000000000000000000016',
    storageKeys: ['0x4a932049252365b3eedbc5190e18949f2ec11f39d3bef2d259764799a1b27d99'],
  }));
  preparedTxRequest = injectPrepareTransactionRequest(() => ({
    to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    value: parseEther('1'),
  }));

  usdtName = injectReadContract(() => ({
    abi: erc20Abi,
    address: this.usdtEthAddress(),
    functionName: 'name',
  }));
  usdtInfo = injectReadContracts(() => ({
    contracts: [
      {
        abi: erc20Abi,
        address: this.usdtEthAddress(),
        functionName: 'name',
      },
      {
        abi: erc20Abi,
        address: this.usdtEthAddress(),
        functionName: 'symbol',
      },
      {
        abi: erc20Abi,
        address: this.usdtEthAddress(),
        functionName: 'decimals',
      },
    ],
  }));

  sendTxM = injectSendTransaction();
  signMessageM = injectSignMessage();

  constructor() {
    this.reconnect.reconnect();

    console.log('client', this.client());
    console.log('publicClient', this.publicClient());
  }

  switchChain(chainId: Chain['id']) {
    this.switchChainM.switchChain({ chainId });
    this.enabled.set(!this.enabled());
  }

  sendTx() {
    this.sendTxM.sendTransaction({
      to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      value: parseEther('0.001'),
    });
  }

  signMessage() {
    this.signMessageM.signMessage({
      message: 'This is a test message. You usually want to integrate for your signing in flow.',
    });
  }
}
