const { createApp } = require('./src/app');
const mongodb = require('./src/mongo');

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/products';

async function startServer() {
  try {
    const app = await createApp(MONGODB_URI);
    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Connected to MongoDB at ${MONGODB_URI}`);
    });

    // Handle shutdown signals
    process.on('SIGINT', () => shutdown(server));
    process.on('SIGTERM', () => shutdown(server));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

async function shutdown(server) {
  console.log('\nShutting down server...');
  server.close(async () => {
    await mongodb.disconnect();
    console.log('Server stopped');
    process.exit(0);
  });
}

startServer();
