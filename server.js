const { ApolloServer } = require("apollo-server-micro");
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");

// Apollo Server for serverless (Vercel)
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

let started = false;

module.exports = async (req, res) => {
  if (!started) {
    await server.start();
    started = true;
  }
  const handler = server.createHandler({ path: "/api/graphql" });
  return handler(req, res);
};