import { Component } from '@angular/core';

import {
  injectAccount,
  injectAccountEffect,
  injectConnect,
  injectConnectors,
  injectReconnect,
} from 'ngx-wagmi';

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
  account = injectAccount();
  accountEffect = injectAccountEffect({
    onConnect: () => console.log('connected'),
    onDisconnect: () => console.log('disconnected'),
  });
  connect = injectConnect();
  connectors = injectConnectors();

  reconnect = injectReconnect();
  readonly injectedConnector = injected();

  constructor() {
    this.reconnect.reconnect();
  }
}
