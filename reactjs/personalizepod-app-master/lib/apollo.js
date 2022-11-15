import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
  split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error";
import { parseCookies } from "nookies";

var CLIENT = null;
const ApolloClientInit = (
  { GRAPHQL_SERVER, GRAPHQL_WS_SERVER, COOKIE_JWT_TOKEN },
  initialState
) => {
  if (CLIENT !== null) {
    return CLIENT;
  }
  const errorLink = onError(
    ({ networkError, graphQLErrors, forward, operation, response }) => {}
  );

  const httpLink = new HttpLink({
    uri: GRAPHQL_SERVER,
  });

  const getToken = () => {
    if (process.browser) {
      return localStorage.getItem(COOKIE_JWT_TOKEN);
    } else {
      return parseCookies(ctx)[COOKIE_JWT_TOKEN];
    }
  };

  const authLink = setContext((_, { headers }) => {
    let token = getToken();
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  if (process.browser) {
    const wsLink = new WebSocketLink({
      uri: GRAPHQL_WS_SERVER,
      options: {
        reconnect: true,
        lazy: true,
        connectionParams: () => {
          let token = getToken();
          return {
            Authorization: token ? `Bearer ${token}` : "",
          };
        },
      },
    });

    CLIENT = new ApolloClient({
      credentials: "include",
      link: ApolloLink.from([
        errorLink,
        authLink,
        split(
          ({ query }) => {
            const definition = getMainDefinition(query);
            return (
              definition.kind === "OperationDefinition" &&
              definition.operation === "subscription"
            );
          },
          wsLink,
          httpLink
        ),
      ]),
      cache: new InMemoryCache().restore(initialState || {}),
    });
  } else {
    CLIENT = new ApolloClient({
      link: ApolloLink.from([errorLink, authLink, httpLink]),
      cache: new InMemoryCache().restore(initialState || {}),
    });
  }
  return CLIENT;
};

export const getClient = () => {
  return CLIENT;
};

export default ApolloClientInit;
