import { Component, computed, signal } from '@angular/core';
import { ConnectButtonComponent } from 'ngx-seedkit';
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
  injectConnections,
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
  injectStorageAt,
  injectSwitchAccount,
  injectSwitchChain,
  injectTransaction,
  injectTransactionConfirmations,
  injectTransactionCount,
  injectTransactionReceipt,
  injectVerifyMessage,
  injectVerifyTypedData,
  injectWaitForTransactionReceipt,
  injectWalletClient,
  injectWatchAsset,
  injectWatchContractEvent,
  injectWatchPendingTransactions,
  injectWriteContract,
} from 'ngx-wagmi';
import { Address, erc20Abi, Hash, parseEther } from 'viem';
import { CardComponent } from '../ui/card.component';

@Component({
  standalone: true,
  imports: [CardComponent, ConnectButtonComponent],
  template: `<div class="p-4">
    <p class="space-x-2">
      <app-connect-button />
    </p>

    <p class="space-x-2 ">
      <strong>Connections</strong>
      @for (item of connections(); track item.connector.id) {
        <button (click)="switchAccountM.switchAccount({ connector: item.connector })" class="btn secondary">
          Switch account from "{{ item.connector.name }}" ({{ item.connector.id }})
        </button>
        <br />
        Account's addresses connected:
        <ul>
          @for (accAddress of item.accounts; track accAddress) {
            <li>{{ accAddress }}</li>
          }
        </ul>
      }
    </p>

    <p class="space-x-2">
      <strong>Connectors</strong>
      @for (item of connectors(); track item.id) {
        <button (click)="item.connect()" class="btn secondary">Connect to {{ item.id }}</button>
      }
    </p>

    <p class="space-x-2">
      <strong>Switch Chain</strong>
      @for (item of chains(); track item.id) {
        <button (click)="switchChainM.switchChain({ chainId: item.id })" class="btn secondary">
          Switch to {{ item.name }}
        </button>
      }
    </p>

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
        "
        class="btn secondary">
        Add USDT to wallet for watching (watchAsset)
      </button>
      {{ watchAssetM.isPending() ? 'Pending...' : '' }}
      {{ watchAssetM.error()?.message }}
    </p>

    <p class="error">
      <button (click)="sendTx()" class="btn secondary">Send transaction</button>
      {{ sendTxM.isPending() ? 'Pending...' : '' }}
      {{ sendTxM.error()?.message }}
    </p>

    <p class="error">
      <button (click)="signMessage()" class="btn secondary">Sign message</button>
      {{ signMessageM.isPending() ? 'Pending...' : '' }}
      {{ signMessageM.error()?.message }}
    </p>

    <p class="error">
      <button (click)="signTypedData()" class="btn secondary">Sign typed data</button>
      {{ signTypedDataM.isPending() ? 'Pending...' : '' }}
      {{ signTypedDataM.error()?.message }}
    </p>
    <p class="error">
      <button (click)="writeContract()" class="btn secondary">Write contract</button>
      {{ writeContractM.isPending() ? 'Pending...' : '' }}
      {{ writeContractM.error()?.message }}
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
    <app-card title="storageAtQ" [query]="storageAtQ" />
    <app-card title="txQ" [query]="txQ" />
    <app-card title="txConfirmationsQ" [query]="txConfirmationsQ" />
    <app-card title="txCountQ" [query]="txCountQ" />
    <app-card title="txReceiptQ" [query]="txReceiptQ" />
    <app-card title="verifyMessageQ" [query]="verifyMessageQ" />
    <app-card title="verifyTypedDataQ" [query]="verifyTypedDataQ" />
    <app-card title="walletClientQ" [query]="walletClientQ" />
  </div>`,
  styles: [
    `
      .btn.secondary {
        color: #ababab;
        text-decoration: underline;
      }
    `,
  ],
})
export default class HomePage {
  // Testing constants
  readonly vitalik = signal({ address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' } as const);
  readonly usdtEthAddress = signal<Address>('0xdac17f958d2ee523a2206206994597c13d831ec7');
  readonly txHash = signal<Address>('0x0fa64daeae54e207aa98613e308c2ba8abfe274f75507e741508cc4db82c8cb5');

  // Only injection
  config = injectConfig();

  // Injection results in Signal
  account = injectAccount();
  address = computed(() => this.account().address);
  chainId = injectChainId();
  chains = injectChains();
  connections = injectConnections();
  connectors = injectConnectors();
  private client = injectClient();
  private publicClient = injectPublicClient();

  // Injection results in TanStack Query
  balanceQ = injectBalance(() => ({
    address: this.address(),
    chainId: this.chainId(),
  }));
  blockQ = injectBlock();
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
  storageAtQ = injectStorageAt(() => ({
    address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
    slot: '0x0',
  }));
  txQ = injectTransaction(() => ({ hash: this.txHash() }));
  txConfirmationsQ = injectTransactionConfirmations(() => ({ hash: this.txHash() }));
  txCountQ = injectTransactionCount(() => ({ address: this.vitalik().address }));
  txReceiptQ = injectTransactionReceipt(() => ({ hash: this.txHash() }));
  verifyMessageQ = injectVerifyMessage(() => signMessagePreset);
  verifyTypedDataQ = injectVerifyTypedData(() => ({ ...typedDataPreset, ...signedTypeDataPreset }));
  waitForTxReceiptQ = injectWaitForTransactionReceipt(() => ({ hash: this.txHash() }));
  walletClientQ = injectWalletClient();

  // Injection results in TanStack Mutation
  connectM = injectConnect();
  disconnectM = injectDisconnect();
  reconnectM = injectReconnect();
  sendTxM = injectSendTransaction();
  signMessageM = injectSignMessage();
  signTypedDataM = injectSignTypedData();
  switchChainM = injectSwitchChain();
  switchAccountM = injectSwitchAccount();
  watchAssetM = injectWatchAsset();
  writeContractM = injectWriteContract();

  // Injection for effect only
  _accountEffect = injectAccountEffect({
    onConnect: () => console.log('connected'),
    onDisconnect: () => console.log('disconnected'),
  });
  // watchBlocks = injectWatchBlocks(() => ({
  //   onBlock: (block) => console.log('block.number', block.number),
  // }));
  // watchBlockNumber = injectWatchBlockNumber(() => ({
  //   onBlockNumber: (blockNumber) => console.log('blockNumber', blockNumber),
  // }));
  watchTransferEvent = injectWatchContractEvent(() => ({
    abi: erc20Abi,
    eventName: 'Transfer',
    address: '0x1Bc38c8465F28e27c9808ab3A5AfAa2b33631FFc',
    onLogs: (logs) => console.log('logs', logs),
  }));
  pendingTxs = injectWatchPendingTransactions(() => ({
    onTransactions: (txs) => console.log('txs', txs),
  }));

  sendTx() {
    this.sendTxM.sendTransaction({
      to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      value: parseEther('0.001'),
    });
  }

  signMessage() {
    this.signMessageM.signMessageAsync({ message: signMessagePreset.message });
  }

  signTypedData() {
    // incompatible between wagmi and viem, wagmi asks for number, viem asks for bigint
    this.signTypedDataM
      .signTypedDataAsync({
        ...typedDataPreset,
        domain: {
          ...typedDataPreset.domain,
          chainId: BigInt(typedDataPreset.domain.chainId),
        },
      })
      .then(console.log);
  }

  writeContract() {
    this.writeContractM.writeContractAsync({
      abi: erc20Abi,
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      functionName: 'transferFrom',
      args: ['0xd2135CfB216b74109775236E36d4b433F1DF507B', '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e', 123n],
    });
  }
}

export const typedDataPreset = {
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
    // incompatible between wagmi and viem, wagmi asks for number, viem asks for bigint
    chainId: 1,
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
} as const;

export const signedTypeDataPreset = {
  address: '0xCe38295c9fe3919694031fa1Cb9BBC09Ea69a538' as Address,
  signature:
    '0x854fd484df643afd1d2f61990a514422c216ba594df1598f0f4212e8fd43b3564351193b40903ef2842b132c036c75714523dd636250312c99dacd96052f14c41c' as Hash,
};

export const signMessagePreset = {
  address: '0xCe38295c9fe3919694031fa1Cb9BBC09Ea69a538' as Address,
  message: 'This is a test message. You usually want to integrate for your signing in flow.',
  signature:
    '0xf5045bd9a2b9c7e88c8d9babb7da4f38e7acf0210fa63c5f0f532d08ffbf3963527ab0dea61bc9aa24d72dfdebc0d685edc8889ad03618a534c7067ae91204b51c' as Hash,
};
