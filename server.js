const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");
const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://SREERAG:Iopjklbnm%401@cluster0.nv5wgtd.mongodb.net/taskmanager?retryWrites=true&w=majority&appName=Cluster0";

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
    // FORCE ENABLE PLAYGROUND - ADD THIS:
    introspection: true,
    playground: {
      settings: {
        'schema.polling.enable': false,
      },
    },
    // Also add this to handle root path:
    context: ({ req }) => {
      // Redirect root to playground
      if (req.url === '/') {
        // This will help trigger the playground
      }
    }
  });

  server.listen().then(({ url }) => {
    console.log(`🚀 API running at ${url}`);
    console.log(`📋 GraphQL Playground: ${url}graphql`);
  });
};

startServer();