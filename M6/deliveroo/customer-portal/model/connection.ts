import mongoose from "mongoose";

const mongoUri = process.env.MONGODB_URI || 'mongodb://root:example@localhost:27017/cp-db?authSource=admin';

let connectionPromise: Promise<void> | null = null;

export async function ensureConnection() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(mongoUri, {
        minPoolSize: 1,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
      })
      .then(() => undefined)
      .catch((err) => {
        connectionPromise = null;
        throw err;
      });
  }

  await connectionPromise;
}

export default mongoose;

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

db.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

db.on('disconnected', () => {
  console.log('Mongoose disconnected');
  connectionPromise = null;
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose disconnected on app termination');
  process.exit(0);
});
