const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");
const mongoose = require("mongoose");

// CORRECTED connection string (no < > brackets, URL-encoded password)
const MONGODB_URI = "mongodb+srv://SREERAG:Iopjklbnm%401@cluster0.nv5wgtd.mongodb.net/taskmanager?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI); // Removed deprecated options
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
  });

  server.listen().then(({ url }) => {
    console.log(`🚀 API running at ${url}`);
  });
};

startServer();