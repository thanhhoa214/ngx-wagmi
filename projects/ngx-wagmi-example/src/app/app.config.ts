import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideTanStackQuery, QueryClient, withDevtools } from '@tanstack/angular-query-experimental';
import { createConfig, http } from '@wagmi/core';
import { arbitrumSepolia, baseSepolia } from '@wagmi/core/chains';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { provideConfig } from 'ngx-wagmi';
import { routes } from './app.routes';

const defaultConfig = createConfig({
  chains: [baseSepolia, arbitrumSepolia],
  transports: {
    [baseSepolia.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    provideTanStackQuery(new QueryClient(), withDevtools()),
    provideConfig(defaultConfig),
    provideHighlightOptions({ fullLibraryLoader: () => import('highlight.js') }),
  ],
};
