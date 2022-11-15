import React from "react";
import { useQuery } from "@apollo/react-hooks";
import sql from "graphql-tag";

const query = sql`
	query {
	sessionContext {
		features
		isBot
		}
	}
`;

const SessionContext = React.createContext({});

export const useSessionContext = React.useContext(SessionContext);

export const SessionContextConsumer = SessionContext.Consumer;

export const SessionContextProvider = ({ isServer, children }) => {
  const { data, loading } = useQuery(query, {
    fetchPolicy: isServer ? "cache-first" : "cache-only",
  });

  return (
    <SessionContext.Provider value={loading ? {} : data.sessionContext}>
      {children}
    </SessionContext.Provider>
  );
};
