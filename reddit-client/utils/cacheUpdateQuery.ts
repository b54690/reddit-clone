import { Cache, QueryInput } from "@urql/exchange-graphcache";

export function cacheUpdateQuery<Result, Query>(
    cache: Cache,
    qi: QueryInput,
    result: any,
    fn: (r: Result, q: Query) => Query | Result | null
  ) {
    return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
  }
  