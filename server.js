const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema/typeDefs");  // FIXED: Added dot (./)
const resolvers = require("./schema/resolvers"); // FIXED: Added dot (./)

const server = new ApolloServer({
    typeDefs,
    resolvers,
    // ADD THESE LINES TO ENABLE PLAYGROUND:
    introspection: true,    // ← Enable introspection
    playground: true,       // ← Enable playground UI
});

server.listen().then(({ url }) => {
    console.log(`🚀 API running at ${url}`);  // FIXED: Used backticks (`)
    console.log(`📋 GraphQL Playground: ${url}graphql`);
});