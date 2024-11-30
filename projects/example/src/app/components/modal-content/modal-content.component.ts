import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-modal-content',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './modal-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'bg-foreground/80 backdrop-blur-sm border py-4 px-6 rounded-xl min-w-80 relative',
  },
})
export class ModalContentComponent {
  readonly xIcon = X;

  title = input.required();
}
