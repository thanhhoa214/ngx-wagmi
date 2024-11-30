import { Component, input } from '@angular/core';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';
import { Highlight } from 'ngx-highlightjs';
import { JsonBigIntPipe } from './jsonBigInt.pipe';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [JsonBigIntPipe, Highlight],
  template: `
    <section>
      <header>
        <h3 class="font-bold text-lg">{{ title() }}</h3>
        <div>
          @for (status of statuses; track status) {
            <small>{{ status }}: {{ query()[status]() ? '✅' : '❌' }}</small>
          }
        </div>
      </header>
      <pre>
<code  [highlight]="query().data() | jsonbi" language="json" class="bg-slate-200"></code>
</pre>
      @if (query().error()?.message) {
        <p class="to-red-600">Error: {{ query().error()?.message }}</p>
      }
      <footer>
        <ng-content />
      </footer>
    </section>
  `,
  styles: [
    `
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      small {
        margin-right: 1rem;
      }
      code {
        max-height: 20vh;
        border-radius: 0.5rem;
        padding: 1rem;
      }
    `,
  ],
})
export class CardComponent {
  statuses = ['isLoading', 'isFetching', 'isError', 'isSuccess', 'isStale'] as const;
  title = input.required<string>();
  query = input.required<CreateQueryResult<any, any>>();
}
