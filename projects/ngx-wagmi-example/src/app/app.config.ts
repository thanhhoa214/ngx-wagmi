import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { provideConfig } from 'ngx-wagmi';

import { provideTanStackQuery, QueryClient, withDevtools } from '@tanstack/angular-query-experimental';
import { createConfig, http } from '@wagmi/core';
import { base, mainnet } from '@wagmi/core/chains';

import { routes } from './app.routes';

const defaultConfig = createConfig({
  chains: [mainnet, base],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
  ssr: true,
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    provideTanStackQuery(new QueryClient(), withDevtools()),
    provideConfig(defaultConfig),
  ],
};
