import type {
  DefaultError,
  QueryKey,
} from '@tanstack/angular-query-experimental';
import type { Config } from '@wagmi/core';
import type { Omit } from '@wagmi/core/internal';

import {
  InjectInfiniteQueryParameters,
  InjectQueryParameters,
} from '../utils/query';

export type EnabledParameter = {
  enabled?: boolean | undefined;
};

export type ConfigParameter<config extends Config = Config> = {
  config?: Config | config | undefined;
};

export type QueryParameter<
  queryFnData = unknown,
  error = DefaultError,
  data = queryFnData,
  queryKey extends QueryKey = QueryKey,
> = {
  query?:
    | Omit<
        InjectQueryParameters<queryFnData, error, data, queryKey>,
        'queryFn' | 'queryHash' | 'queryKey' | 'queryKeyHashFn' | 'throwOnError'
      >
    | undefined;
};

export type InfiniteQueryParameter<
  queryFnData = unknown,
  error = DefaultError,
  data = queryFnData,
  queryData = queryFnData,
  queryKey extends QueryKey = QueryKey,
  pageParam = unknown,
> = {
  query: Omit<
    InjectInfiniteQueryParameters<queryFnData, error, data, queryData, queryKey, pageParam>,
    'queryFn' | 'queryHash' | 'queryKey' | 'queryKeyHashFn' | 'throwOnError'
  >;
};
