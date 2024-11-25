import {
  effect,
  signal,
} from '@angular/core';

import {
  getAccount,
  watchAccount,
} from '@wagmi/core';

import { injectConfig } from './config';
import { InjectConnectorsParameters } from './connectors';

export const injectAccount = (parameters: InjectConnectorsParameters = {}) => {
  const config = injectConfig(parameters);
  const account = signal(getAccount(config));

  effect((onClean) =>
    onClean(
      watchAccount(config, {
        onChange: (newAccount) => account.set(newAccount),
      })
    )
  );

  return account.asReadonly();
};
