import { provideHttpClient } from '@angular/common/http';
import {
  APP_INITIALIZER,
  ApplicationConfig,
  isDevMode,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  binanceWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { provideTanStackQuery, QueryClient, withDevtools } from '@tanstack/angular-query-experimental';
import { inject } from '@vercel/analytics';
import { createConfig, http } from '@wagmi/core';
import { arbitrumSepolia, baseSepolia, mainnet } from '@wagmi/core/chains';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { provideSeedkitConfig } from 'ngx-seedkit';
import { provideWagmiConfig } from 'ngx-wagmi';
import { routes } from './app.routes';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [rainbowWallet, metaMaskWallet, walletConnectWallet, binanceWallet, safeWallet],
    },
    { groupName: 'Other', wallets: [metaMaskWallet, walletConnectWallet, trustWallet] },
  ],
  {
    appName: 'ngx-wagmi example',
    projectId: '0c2cc40f9f142ce85e160f33849f7b9b',
    appDescription: 'ngx-wagmi example',
    appUrl: 'https://ngx-wagmi.github.io',
  },
);

const defaultConfig = createConfig({
  connectors,
  chains: [baseSepolia, mainnet, arbitrumSepolia],
  transports: {
    [baseSepolia.id]: http(),
    [mainnet.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        inject({ mode: isDevMode() ? 'development' : 'production' });
      },
    },
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    provideTanStackQuery(new QueryClient(), withDevtools()),
    provideWagmiConfig(defaultConfig),
    provideSeedkitConfig({ initialChainId: 1 }),
    provideHighlightOptions({ fullLibraryLoader: () => import('highlight.js') }),
  ],
};
