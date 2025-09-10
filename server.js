const { ApolloServer } = require("apollo-server-micro");
const { ApolloServerPluginLandingPageProductionDefault } = require("apollo-server-core");
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");

// Serverless handler for Vercel with Playground UI
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [ApolloServerPluginLandingPageProductionDefault({ embed: true })],
});

// Ensure server starts only once
const startServerPromise = server.start();

module.exports = async (req, res) => {
  // CORS headers for Playground and external clients
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Apollo-Require-Preflight"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  // Let Apollo's embedded Sandbox handle GET UI
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  await startServerPromise;
  const handler = server.createHandler({ path: "/api/graphql" });
  return handler(req, res);
};