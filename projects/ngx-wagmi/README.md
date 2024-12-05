# ngx-wagmi

**ngx-wagmi** is a **wagmi-compatible library for Angular 18**, built entirely with **Signal**. It empowers Angular developers to seamlessly integrate Web3 functionality into their applications. With **ngx-wagmi**, you get a powerful suite of tools to interact with wallets, contracts, and blockchain networks—all optimized for Angular's reactive architecture.

## 🚀 Features

ngx-wagmi supports a comprehensive set of Web3 functions, enabling robust blockchain interactions:

### 🌟 Account Management

- `account.ts` – Get the current account details.
- `accountEffect.ts` – Reactively handle account changes.
- `switchAccount.ts` – Switch between connected accounts.
- `disconnect.ts` – Disconnect the wallet.

### 🔢 Balances & Transactions

- `balance.ts` – Fetch the balance of an account.
- `transaction.ts` – Retrieve transaction details.
- `transactionCount.ts` – Get the number of transactions from an account.
- `transactionConfirmations.ts` – Check the number of confirmations for a transaction.
- `sendTransaction.ts` – Send a transaction.
- `waitForTransactionReceipt.ts` – Wait for a transaction receipt.

### 🔗 Blockchain Data

- `block.ts` – Fetch block details.
- `blockTransactionCount.ts` – Get the transaction count for a block.
- `feeHistory.ts` – Retrieve historical fee data.
- `gasPrice.ts` – Get the current gas price.
- `estimateGas.ts` – Estimate gas usage for a transaction.

### 📦 Contracts

- `deployContract.ts` – Deploy a smart contract.
- `readContract.ts` – Read from a smart contract.
- `readContracts.ts` – Read multiple smart contracts in a single call.
- `simulateContract.ts` – Simulate a contract interaction.
- `writeContract.ts` – Write data to a smart contract.

### 🧑‍🎤 ENS (Ethereum Name Service)

- `ensAddress.ts` – Resolve an ENS name to an address.
- `ensName.ts` – Get the ENS name for an address.
- `ensAvatar.ts` – Fetch the avatar for an ENS profile.
- `ensResolver.ts` – Get the resolver for an ENS name.
- `ensText.ts` – Retrieve ENS text records.

### 🛠️ Utility Functions

- `bytecode.ts` – Retrieve contract bytecode.
- `storageAt.ts` – Read raw storage data at a given position.
- `prepareTransactionRequest.ts` – Prepare a transaction request.
- `proof.ts` – Generate a proof for a Merkle tree.

### 🔍 Verification

- `verifyMessage.ts` – Verify a signed message.
- `verifyTypedData.ts` – Verify typed data signatures.

### 🔄 Reactivity

- `watchBlockNumber.ts` – Watch for new block numbers.
- `watchBlocks.ts` – Watch for new blocks.
- `watchPendingTransactions.ts` – Watch for pending transactions.
- `watchContractEvent.ts` – Listen to contract events.

### 🛡️ Chain & Wallet Management

- `chains.ts` – Access supported chains.
- `switchChain.ts` – Switch to a different chain.
- `connect.ts` – Connect to a wallet.
- `connections.ts` – Manage multiple connections.
- `connectorClient.ts` – Access the connector client.
- `walletClient.ts` – Use the wallet client.
- `watchAsset.ts` – Add a token to the wallet.

## 📦 Installation

Install **ngx-wagmi** via npm:

```bash
npm install ngx-wagmi
```

## 🛠️ Usage

### 1. Setup injection tokens

**Highly recommended setup with `ngx-seedkit` for ready-to-use ConnectWallet supports widely-known wallets**

In your `app.config.ts`. Check [advanced example](https://github.com/thanhhoa214/ngx-wagmi/blob/84ec54075789828dec47d079c25c353abcc77172/projects/example/src/app/app.config.ts) from demo page

```typescript
import { http, createConfig } from '@wagmi/core'
import { mainnet, sepolia } from '@wagmi/core/chains'
import { provideTanStackQuery, QueryClient, withDevtools } from '@tanstack/angular-query-experimental';
import { provideWagmiConfig } from 'ngx-wagmi';

const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})


export const appConfig: ApplicationConfig = {
  providers: [
    ...
    provideTanStackQuery(new QueryClient(), withDevtools()),
    provideWagmiConfig(config),
    ...
  ]
}
```

### 2. Import **ngx-wagmi** and start using its functionalities in your Angular application:

```typescript
import { injectConnect } from 'ngx-wagmi';

...
// Example: Connect to a wallet
connectM = injectConnect()

constructor() {
    connectM.connect()
    // or
    await connectM.connectAsync()
}...
```

## 📖 Documentation

WIP

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests on GitHub.

## 🌟 License

This library is released under the [MIT License](LICENSE).
