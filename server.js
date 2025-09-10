const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");
const mongoose = require("mongoose");
require('dotenv').config(); // ADD THIS LINE

const MONGODB_URI = process.env.MONGODB_URI; // USE ENV VARIABLE
const PORT = process.env.PORT || 4000; // ADD PORT

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const startServer = async () => {
  await connectDB();
  
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
  });

  server.listen(PORT).then(({ url }) => {
    console.log(`🚀 API running at ${url}`);
    console.log(`📋 GraphQL Playground: ${url}graphql`);
  });
};

startServer();