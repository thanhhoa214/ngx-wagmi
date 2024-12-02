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
  host: { class: 'block' },
})
export class ConnectModalQrcodeComponent {
  connector = input.required<WalletConnector>();
  qrcodeUri = derivedAsync(() => this.connector().getQrCodeUri?.());
  logoUrl = derivedAsync(() => getConnectorIconUrl(this.connector()));

  ngOnInit() {
    this.connector().connect();
  }
}
