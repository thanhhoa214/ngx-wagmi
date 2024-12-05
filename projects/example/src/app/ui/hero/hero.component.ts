import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ArrowDown, Github, LucideAngularModule, Send } from 'lucide-angular';
import { ConnectButtonComponent } from 'ngx-seedkit';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [LucideAngularModule, ConnectButtonComponent],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  icons = { ArrowDown, Send, Github };
}
