import { ChangeDetectionStrategy, Component, computed, effect, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { injectAccount } from 'ngx-wagmi';
import { CallPipe } from '../../pipes/call.pipe';
import { AccountModalComponent } from '../account-modal/account-modal.component';
import { ConnectWalletModalComponent } from '../connect-modal/connect-modal.component';
import { ModalComponent } from '../modal/modal.component';
import { emojiAvatarForAddress } from './emojiAvatarForAddress';
import { provideRainbowKitChains } from './provideRainbowKitChains';

@Component({
  selector: 'app-connect-button',
  standalone: true,
  imports: [LucideAngularModule, ConnectWalletModalComponent, CallPipe, FormsModule, AccountModalComponent],
  templateUrl: './connect-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectButtonComponent {
  readonly emojiAvatarForAddress = emojiAvatarForAddress;
  readonly shortenAddress = (address: string) => address.slice(0, 6) + '...' + address.slice(-4);

  account = injectAccount();
  avatar = computed(() => this.account().address && this.emojiAvatarForAddress(this.account().address!));
  currentChain = computed(() => {
    const wagmiChain = this.account().chain;
    if (!wagmiChain) return null;
    return provideRainbowKitChains([wagmiChain])[0];
  });

  connectModal = viewChild<string, ModalComponent>('connectModal', { read: ModalComponent });
  modalOpenning = signal(false);

  constructor() {
    effect(
      () => {
        if (this.account().isConnected) this.connectModal()?.hide();
      },
      { allowSignalWrites: true },
    );
  }
}
