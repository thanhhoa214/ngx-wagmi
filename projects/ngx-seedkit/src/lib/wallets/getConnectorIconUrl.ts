import { WalletConnector } from './injectWalletConnectors';

export const getConnectorIconUrl = (connector: WalletConnector) => {
  const { iconUrl } = connector;
  if (typeof iconUrl === 'string') return iconUrl;
  return iconUrl();
};
