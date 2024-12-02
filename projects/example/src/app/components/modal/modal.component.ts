import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';
import { ClickOutside } from 'ngxtension/click-outside';
import { twMerge } from 'tailwind-merge';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [LucideAngularModule, ClickOutside],
  templateUrl: './modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  readonly xIcon = X;
  readonly tm = twMerge;

  title = input.required({ alias: 'modalTitle' });
  contentClass = input<string>();
  closeOnBackdropClick = input<boolean>(true);
  modalOpening = model<boolean>(false);

  open = output<void>();
  close = output<void>();

  show() {
    this.modalOpening.set(true);
    this.open.emit();
  }

  hide() {
    this.modalOpening.set(false);
    this.close.emit();
  }
}
