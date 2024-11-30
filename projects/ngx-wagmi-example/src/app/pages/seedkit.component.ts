import { Component } from '@angular/core';
import { ConnectButtonComponent } from '../components/connect-button/connect-button.component';

@Component({
  standalone: true,
  template: `<app-connect-button />`,
  imports: [ConnectButtonComponent],
})
export default class SeedkitPage {}
