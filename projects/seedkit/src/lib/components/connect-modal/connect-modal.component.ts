import { ChangeDetectionStrategy, Component, computed, effect, model, signal, viewChild } from '@angular/core';

import { KeyValuePipe } from '@angular/common';
import { injectConnect } from 'ngx-wagmi';
import { derivedAsync } from 'ngxtension/derived-async';
import { groupBy } from '../../utils/groupBy';
import { getConnectorIconUrl } from '../../wallets/getConnectorIconUrl';
import { injectWalletConnectors, WalletConnector } from '../../wallets/injectWalletConnectors';
import {
  ConnectModalQrcodeComponent,
  WALLET_CONNECT_CONNECTOR_ID,
} from '../connect-modal-qrcode/connect-modal-qrcode.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-connect-modal',
  standalone: true,
  imports: [ModalComponent, ConnectModalQrcodeComponent, KeyValuePipe],
  templateUrl: './connect-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex flex-col items-center justify-center' },
})
export class ConnectWalletModalComponent {
  readonly WALLET_CONNECT_CONNECTOR_ID = WALLET_CONNECT_CONNECTOR_ID;
  private connectM = injectConnect();

  // Input
  modalOpening = model(false);
  private connectModal = viewChild<string, ModalComponent>('connectModal', { read: ModalComponent });

  title = signal('Connect Wallet');
  iconUrls = derivedAsync(
    async () => {
      const iconUrls = await Promise.all(this.wallets().map(getConnectorIconUrl));
      return iconUrls.reduce(
        (acc, iconUrl, i) => {
          if (!iconUrl) return acc;
          const w = this.wallets()[i];
          // Remove new lines from the icon url for Phantom
          acc[w.id] = iconUrl.replace(/\n/gi, '');
          return acc;
        },
        {} as Record<string, string>,
      );
    },
    { initialValue: {} },
  );
  connectingConnector = signal<WalletConnector | null>(null);

  // The `WalletButton` component made the connect modal appear empty when trying to connect.
  // This happened because of a mix up between EIP-6963 and RainbowKit connectors.
  // The problem was finding the correct `wallet.id`. `WalletButton` uses RainbowKit's id,
  // but EIP-6963 uses `rdns` for its id. We now don't merge EIP-6963 and RainbowKit
  // connectors if user interacts with `WalletButton` component.
  private mergeEIP6963WithRkConnectors = computed(() => !this.connectingConnector());
  private walletsInjection = injectWalletConnectors(this.mergeEIP6963WithRkConnectors);
  wallets = computed(() =>
    this.walletsInjection()
      .filter((wallet) => wallet.ready || !!wallet.extensionDownloadUrl)
      .sort((a, b) => a.groupIndex - b.groupIndex),
  );
  unfilteredWallets = injectWalletConnectors();
  connectorGroups = computed(() => groupBy(this.wallets(), (wallet) => wallet.groupName));

  constructor() {
    // Use linkedSignal in v19
    effect(
      () => {
        const connector = this.connectingConnector();
        if (connector?.type === WALLET_CONNECT_CONNECTOR_ID) this.title.set(`Scan with ${connector.name}`);
        else this.title.set('Connect Wallet');
      },
      { allowSignalWrites: true },
    );

    effect(() => {
      if (!!this.connectM.data()) this.connectingConnector.set(null);
    });
  }

  show() {
    this.connectModal()?.show();
  }

  async connect(connector: WalletConnector) {
    this.connectingConnector.set(connector);
    if (connector.type === WALLET_CONNECT_CONNECTOR_ID) return;
    await connector.connect();
  }
}
