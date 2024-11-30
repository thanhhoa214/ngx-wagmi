import { Component } from '@angular/core';
import { ConnectButtonComponent } from '../components/connect-button/connect-button.component';

@Component({
  standalone: true,
  template: `
    <div class="p-4">
      <app-connect-button />
    </div>
  `,
  imports: [ConnectButtonComponent],
})
export default class SeedkitPage {}
