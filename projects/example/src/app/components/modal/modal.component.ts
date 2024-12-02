import { ChangeDetectionStrategy, Component, ElementRef, input, model, viewChild } from '@angular/core';
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

  modal = viewChild.required<ElementRef<HTMLDialogElement>>('modal');

  show() {
    this.modalOpening.set(true);
    this.modal().nativeElement.showModal();
  }

  hide() {
    this.modalOpening.set(false);
    this.modal().nativeElement.close();
  }
}
