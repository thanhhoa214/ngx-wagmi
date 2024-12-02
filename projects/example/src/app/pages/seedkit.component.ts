import { Component } from '@angular/core';
import { ConnectButtonComponent } from 'ngx-seedkit';
import { injectReconnect } from 'ngx-wagmi';

@Component({
  standalone: true,
  template: `
    <div class="p-4">
      <app-connect-button />
    </div>
  `,
  imports: [ConnectButtonComponent],
})
export default class SeedkitPage {
  reconnectM = injectReconnect();

  constructor() {
    this.reconnectM.reconnect();
  }
}
