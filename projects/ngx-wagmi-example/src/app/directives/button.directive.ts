import { Directive } from '@angular/core';

@Directive({ selector: '[skButton]', exportAs: 'skButton', standalone: true, host: { class: '' } })
export class SkButtonDirective {}
