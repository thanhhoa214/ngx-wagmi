import { ChangeDetectionStrategy, Component, ElementRef, signal, viewChild } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ConnectWalletModalComponent } from '../connect-wallet-modal/connect-wallet-modal.component';

@Component({
  selector: 'app-connect-button',
  standalone: true,
  imports: [LucideAngularModule, ConnectWalletModalComponent],
  templateUrl: './connect-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectButtonComponent {
  modalOpenning = signal(false);
  modal = viewChild<string, ElementRef<HTMLDialogElement>>('modal', { read: ElementRef });

  showModal() {
    this.modalOpenning.set(true);
    this.modal()?.nativeElement.showModal();
  }
}
