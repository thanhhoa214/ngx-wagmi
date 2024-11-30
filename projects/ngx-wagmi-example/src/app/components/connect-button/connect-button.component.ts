import { ChangeDetectionStrategy, Component, effect, ElementRef, signal, viewChild } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { injectAccount, injectConfig } from 'ngx-wagmi';
import { CallPipe } from '../../call.pipe';
import { ConnectWalletModalComponent } from '../connect-wallet-modal/connect-wallet-modal.component';
import { emojiAvatarForAddress } from './emojiAvatarForAddress';

@Component({
  selector: 'app-connect-button',
  standalone: true,
  imports: [LucideAngularModule, ConnectWalletModalComponent, CallPipe],
  templateUrl: './connect-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectButtonComponent {
  modalOpenning = signal(false);
  modal = viewChild<string, ElementRef<HTMLDialogElement>>('modal', { read: ElementRef });
  account = injectAccount();
  config = injectConfig();

  readonly emojiAvatarForAddress = emojiAvatarForAddress;
  readonly shortenAddress = (address: string) => address.slice(0, 6) + '...' + address.slice(-4);

  constructor() {
    effect(
      () => {
        if (this.account().isConnected) {
          this.modalOpenning.set(false);
          this.modal()?.nativeElement.close();
        }
      },
      { allowSignalWrites: true },
    );
  }

  showModal() {
    this.modalOpenning.set(true);
    this.modal()?.nativeElement.showModal();
  }
}
