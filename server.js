const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB Atlas");
    
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      introspection: true,
      playground: true,
    });

    return server.createHandler();
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

module.exports = startServer();