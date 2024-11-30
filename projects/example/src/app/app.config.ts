import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { metaMaskWallet, rainbowWallet, trustWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { provideTanStackQuery, QueryClient, withDevtools } from '@tanstack/angular-query-experimental';
import { createConfig, http } from '@wagmi/core';
import { arbitrumSepolia, baseSepolia, mainnet } from '@wagmi/core/chains';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { provideConfig } from 'ngx-wagmi';
import { routes } from './app.routes';

const connectors = connectorsForWallets(
  [
    { groupName: 'Recommended', wallets: [rainbowWallet, metaMaskWallet, walletConnectWallet] },
    { groupName: 'Other', wallets: [metaMaskWallet, walletConnectWallet, trustWallet] },
  ],
  {
    appName: 'ngx-wagmi example',
    projectId: '0c2cc40f9f142ce85e160f33849f7b9b',
    appDescription: 'ngx-wagmi example',
    appUrl: 'https://bonder.market',
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
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),
    provideTanStackQuery(new QueryClient(), withDevtools()),
    provideConfig(defaultConfig),
    provideHighlightOptions({ fullLibraryLoader: () => import('highlight.js') }),
  ],
};
