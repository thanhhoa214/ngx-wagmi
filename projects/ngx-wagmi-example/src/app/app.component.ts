import { Component } from '@angular/core';

import { account, injectConnect, injectConnectors } from 'ngx-wagmi';

import { injected } from '@wagmi/connectors';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    hello {{ account().address }}
    @for (item of connectors(); track item.id) {
    <button (click)="item.connect()">Connect to {{ item.id }}</button>
    }
    <br />
    <button (click)="connect.connect({ connector: injectedConnector })">
      Connect
    </button>
  `,
})
export class AppComponent {
  account = account();
  connect = injectConnect();
  connectors = injectConnectors();

  injectedConnector = injected();
}
