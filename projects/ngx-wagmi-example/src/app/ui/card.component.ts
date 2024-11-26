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
        <h3>{{ title() }}</h3>
        <div>
          @for (status of statuses; track status) {
            <small class="loading">{{ status }}: {{ query()[status]() ? '✅' : '❌' }}</small>
          }
        </div>
      </header>
      <pre>
<code [highlight]="query().data() | jsonbi" language="json" ></code>
</pre>
      @if (query().error()?.message) {
        <p>Error: {{ query().error()?.message }}</p>
      }
    </section>
  `,
  styles: [
    `
      h3 {
        margin: 0;
      }
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      small {
        margin-right: 1rem;
      }
      .loading {
        color: blue;
      }
      code {
        max-height: 20vh;
        background-color: #f4f4f4;
        border-radius: 0.5rem;
        padding: 1rem;
      }
      p {
        color: red;
      }
    `,
  ],
})
export class CardComponent {
  statuses = ['isLoading', 'isFetching', 'isError', 'isSuccess', 'isStale'] as const;
  title = input.required<string>();
  query = input.required<CreateQueryResult<any, any>>();
}
