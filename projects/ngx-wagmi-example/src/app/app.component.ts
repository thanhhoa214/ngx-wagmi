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
  injectSignTypedData,
  injectSimulateContract,
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
          <button (click)="connectM.connect({ connector: injectedConnector })">Connect</button>
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

      <p class="error">
        <button (click)="signTypedData()">Sign typed data</button>
        {{ signTypedDataM.error()?.message }}
      </p>

      <app-card title="Current block" [query]="blockQ" />
      <app-card title="Current block tx count" [query]="blockTxCountQ" />
      <app-card title="Balance" [query]="balanceQ" />
      <app-card title="Bytecode" [query]="bytecodeQ" />
      <app-card title="Connector Client" [query]="connectorClientQ" />
      <app-card title="ensAddressQ of vitalik" [query]="ensAddressQ" />
      <app-card title="ensNameQ of vitalik" [query]="ensNameQ" />
      <app-card title="ensAvatarQ of vitalik" [query]="ensAvatarQ" />
      <app-card title="ensResolverQ of vitalik" [query]="ensResolverQ" />
      <app-card title="ensTextQ of vitalik" [query]="ensTextQ" />
      <app-card title="feesPerGasQ" [query]="feesPerGasQ" />
      <app-card title="gasQ" [query]="gasQ" />
      <app-card title="maxPriorityFeePerGasQ" [query]="maxPriorityFeePerGasQ" />
      <app-card title="feeHistoryQ" [query]="feeHistoryQ" />
      <app-card title="gasPriceQ" [query]="gasPriceQ" />
      <app-card title="proofQ" [query]="proofQ" />
      <app-card title="preparedTxRequestQ" [query]="preparedTxRequestQ" />
      <app-card title="usdtNameQ" [query]="usdtNameQ" />
      <app-card title="usdtInfoQ" [query]="usdtInfoQ">
        <button (click)="usdtEthAddress.set('0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9')">Fetch AAVE info</button>
      </app-card>
    </div>
  `,
  imports: [CardComponent],
})
export class AppComponent {
  // Testing constants
  readonly enabled = signal(true);
  readonly vitalik = signal({ address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' } as const);
  readonly usdtEthAddress = signal<Address>('0xdac17f958d2ee523a2206206994597c13d831ec7');
  readonly injectedConnector = injected();

  // Only injection
  config = injectConfig();

  // Injection results in Signal
  account = injectAccount();
  address = computed(() => this.account().address);
  chainId = injectChainId();
  chains = injectChains();
  connectors = injectConnectors();
  private client = injectClient();
  private publicClient = injectPublicClient();

  // Injection results in TanStack Query
  balanceQ = injectBalance(() => ({
    address: this.address(),
    chainId: this.chainId(),
  }));
  blockQ = injectBlock(() => ({ watch: true }));
  blockTxCountQ = injectBlockTransactionCount(() => ({
    blockNumber: this.blockQ.data()?.number,
  }));
  bytecodeQ = injectBytecode(() => ({ address: this.address() }));
  connectorClientQ = injectConnectorClient();
  ensAddressQ = injectEnsAddress(() => ({ name: 'vitalik.eth' }));
  ensNameQ = injectEnsName(() => ({ address: this.vitalik().address }));
  ensAvatarQ = injectEnsAvatar(() => ({
    name: this.ensNameQ.data()!,
    query: { enabled: !!this.ensNameQ.data() },
  }));
  ensTextQ = injectEnsText(() => ({
    name: this.ensNameQ.data()!,
    key: 'com.twitter',
    query: { enabled: !!this.ensNameQ.data() },
  }));
  ensResolverQ = injectEnsResolver(() => ({
    name: this.ensNameQ.data()!,
    query: { enabled: !!this.ensNameQ.data() },
  }));
  feesPerGasQ = injectEstimateFeesPerGas();
  gasQ = injectEstimateGas();
  maxPriorityFeePerGasQ = injectEstimateMaxPriorityFeePerGas();
  feeHistoryQ = injectFeeHistory(() => ({ blockCount: 4, rewardPercentiles: [25, 75] }));
  gasPriceQ = injectGasPrice();
  proofQ = injectProof(() => ({
    address: '0x4200000000000000000000000000000000000016',
    storageKeys: ['0x4a932049252365b3eedbc5190e18949f2ec11f39d3bef2d259764799a1b27d99'],
  }));
  preparedTxRequestQ = injectPrepareTransactionRequest(() => ({
    to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    value: parseEther('1'),
  }));
  usdtNameQ = injectReadContract(() => ({
    abi: erc20Abi,
    address: this.usdtEthAddress(),
    functionName: 'name',
  }));
  usdtInfoQ = injectReadContracts(() => ({
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
  simulateContractQ = injectSimulateContract(() => ({
    abi: erc20Abi,
    address: '0x6b175474e89094c44da98b954eedeac495271d0f' as const,
    functionName: 'transferFrom',
    args: [
      '0xd2135CfB216b74109775236E36d4b433F1DF507B' as const,
      '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e' as const,
      123n,
    ],
  }));

  // Injection results in TanStack Mutation
  connectM = injectConnect();
  disconnectM = injectDisconnect();
  reconnectM = injectReconnect();
  sendTxM = injectSendTransaction();
  signMessageM = injectSignMessage();
  signTypedDataM = injectSignTypedData();
  switchChainM = injectSwitchChain();
  watchAssetM = injectWatchAsset();

  // Injection for effect only
  _accountEffect = injectAccountEffect({
    onConnect: () => console.log('connected'),
    onDisconnect: () => console.log('disconnected'),
  });
  watchBlocks = injectWatchBlocks(() => ({
    onBlock: (block) => console.log('block.number', block.number),
  }));
  watchBlockNumber = injectWatchBlockNumber(() => ({
    onBlockNumber: (blockNumber) => console.log('blockNumber', blockNumber),
  }));

  constructor() {
    this.reconnectM.reconnect();

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

  signTypedData() {
    this.signTypedDataM
      .signTypedDataAsync({
        types: {
          EIP712Domain: [
            { name: 'name', type: 'string' },
            { name: 'version', type: 'string' },
            { name: 'chainId', type: 'uint256' },
            { name: 'verifyingContract', type: 'address' },
          ],
          Person: [
            { name: 'name', type: 'string' },
            { name: 'wallet', type: 'address' },
          ],
          Mail: [
            { name: 'from', type: 'Person' },
            { name: 'to', type: 'Person' },
            { name: 'contents', type: 'string' },
          ],
        },
        primaryType: 'Mail',
        domain: {
          name: 'Ether Mail',
          version: '1',
          chainId: BigInt(1),
          verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
        },
        message: {
          from: {
            name: 'Cow',
            wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
          },
          to: {
            name: 'Bob',
            wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
          },
          contents: 'Hello, Bob!',
        },
      })
      .then(console.log);
  }
}
