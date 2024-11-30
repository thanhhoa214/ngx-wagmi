import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-account-modal',
  standalone: true,
  imports: [],
  templateUrl: './account-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountModalComponent { }
