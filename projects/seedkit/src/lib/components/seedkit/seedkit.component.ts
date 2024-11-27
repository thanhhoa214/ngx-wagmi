import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'lib-seedkit',
  standalone: true,
  imports: [],
  templateUrl: './seedkit.component.html',
  styleUrl: './seedkit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeedkitComponent {
  dialogOpening = signal(false);
}
