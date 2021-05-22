import { dedupExchange, fetchExchange } from 'urql';
import { cacheExchange } from "@urql/exchange-graphcache";
import { LogoutMutation, LoggedInQuery, LoggedInDocument, LoginMutation, RegisterMutation, RegisterDocument } from '../src/generated/graphql';
import { cacheUpdateQuery } from './cacheUpdateQuery';

// ssrExchange refers to server side rendering 
export const createUrqlClient = (ssrExchange: any) => ({
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
      credentials: 'include' as const,
      // 'include' alludes to whether credentials should be sent with the server request 
    },
    // Updates the loggedIn query everytime a register or login mutation is run
    exchanges: [dedupExchange, cacheExchange({
      updates: {
        Mutation: {
          logout: (_result, args, cache, info) => {
            cacheUpdateQuery<LogoutMutation, LoggedInQuery>(
              cache,
              { query: LoggedInDocument },
              _result,
              () => ({ loggedIn: null })
            )
          },
          login: (_result, args, cache, info) => {
            cacheUpdateQuery<LoginMutation, LoggedInQuery>(
              cache,
              { query: LoggedInDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    loggedIn: result.login.user
                  };
                };
              }
            )
          },
          register: (_result, args, cache, info) => {
            cacheUpdateQuery<RegisterMutation, LoggedInQuery>(
              cache,
              { query: LoggedInDocument },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query;
                } else {
                  return {
                    loggedIn: result.register.user
                  };
                };
              }
            )
          }
        }
      }
    }), 
    fetchExchange,
    ssrExchange
]
})