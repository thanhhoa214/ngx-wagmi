import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { derivedAsync } from 'ngxtension/derived-async';
import { getConnectorIconUrl } from '../../wallets/getConnectorIconUrl';
import { WalletConnector } from '../../wallets/injectWalletConnectors';
import { QRCodeComponent } from './qrcode.component';
export const WALLET_CONNECT_CONNECTOR_ID = 'walletConnect';

@Component({
  selector: 'app-connect-modal-qrcode',
  standalone: true,
  imports: [QRCodeComponent],
  templateUrl: './connect-modal-qrcode.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'sk-block' },
})
export class ConnectModalQrcodeComponent {
  placeholderUri =
    'wc:c50309d92264017e73cef008e5428ef4dcfe49340a75725b90d02471d4bbbf77@2?expiryTimestamp=110000000&relay-protocol=irn&symKey=d8e95356e5773bb05170ff71523921509dd26e09509eba10c61b4b86bfa7bb9a';

  connector = input.required<WalletConnector>();
  qrcodeUri = derivedAsync(() => this.connector().getQrCodeUri?.());
  logoUrl = derivedAsync(() => getConnectorIconUrl(this.connector()));

  ngOnInit() {
    this.connector().connect();
  }
}
