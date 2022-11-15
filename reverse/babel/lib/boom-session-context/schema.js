import { makeExecutableSchema } from "graphql-tools";
import sql from "graphql-tag";
const resolvers = {
  Query: {
    sessionContext: (_, args, context) => {
      return {
        features: context.req.features,
        isBot: context.req.header("X-RB-Bot-Identified") === "True"
      };
    }
  }
};
export const typeDefs = sql`
	scheme {
	  query: Query
  }

  type Query {
    sessionContext: SessionContext!
  }
  type SessionContext {
    features: [String!]!
    isBot: Boolean!
  }
`;
export const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers
});