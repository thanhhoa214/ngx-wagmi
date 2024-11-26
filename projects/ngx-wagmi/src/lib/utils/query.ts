import {
  injectMutation,
  injectInfiniteQuery as tanstack_injectInfiniteQuery,
  type CreateInfiniteQueryOptions,
  type CreateInfiniteQueryResult,
  type CreateMutationOptions,
  type CreateMutationResult,
  type CreateQueryOptions,
  type CreateQueryResult,
  type DefaultError,
  type QueryKey,
} from '@tanstack/angular-query-experimental';
import type { Compute, ExactPartial, Omit, UnionStrictOmit } from '@wagmi/core/internal';
import { hashFn } from '@wagmi/core/query';

export const emptyObjFn = () => ({});
export const queryOptionsSupportBigInt = {
  queryKeyHashFn: hashFn, // for bigint support
} as const;

export type InjectMutationParameters<data = unknown, error = Error, variables = void, context = unknown> = Compute<
  Omit<CreateMutationOptions<data, error, Compute<variables>, context>, 'mutationFn' | 'mutationKey' | 'throwOnError'>
>;

export type InjectMutationReturnType<data = unknown, error = Error, variables = void, context = unknown> = Compute<
  UnionStrictOmit<CreateMutationResult<data, error, variables, context>, 'mutate' | 'mutateAsync'>
>;

export { injectMutation };

////////////////////////////////////////////////////////////////////////////////

export type InjectQueryParameters<
  queryFnData = unknown,
  error = DefaultError,
  data = queryFnData,
  queryKey extends QueryKey = QueryKey,
> = Compute<
  ExactPartial<Omit<CreateQueryOptions<queryFnData, error, data, queryKey>, 'initialData'>> & {
    // Fix `initialData` type
    initialData?: CreateQueryOptions<queryFnData, error, data, queryKey>['initialData'] | undefined;
  }
>;

export type InjectQueryReturnType<data = unknown, error = DefaultError> = Compute<
  CreateQueryResult<data, error> & {
    queryKey: QueryKey;
  }
>;

////////////////////////////////////////////////////////////////////////////////

export type InjectInfiniteQueryParameters<
  queryFnData = unknown,
  error = DefaultError,
  data = queryFnData,
  queryData = queryFnData,
  queryKey extends QueryKey = QueryKey,
  pageParam = unknown,
> = Compute<
  Omit<CreateInfiniteQueryOptions<queryFnData, error, data, queryData, queryKey, pageParam>, 'initialData'> & {
    // Fix `initialData` type
    initialData?: CreateInfiniteQueryOptions<queryFnData, error, data, queryKey>['initialData'] | undefined;
  }
>;

export type InjectInfiniteQueryReturnType<data = unknown, error = DefaultError> = CreateInfiniteQueryResult<
  data,
  error
> & {
  queryKey: QueryKey;
};

// Adding some basic customization.
export function injectInfiniteQuery<queryFnData, error, data, queryKey extends QueryKey>(
  parameters: InjectInfiniteQueryParameters<queryFnData, error, data, queryKey> & {
    queryKey: QueryKey;
  },
): InjectInfiniteQueryReturnType<data, error> {
  const result = tanstack_injectInfiniteQuery({
    ...(parameters as any),
    queryKeyHashFn: hashFn, // for bigint support
  }) as InjectInfiniteQueryReturnType<data, error>;
  result.queryKey = parameters.queryKey;
  return result;
}
