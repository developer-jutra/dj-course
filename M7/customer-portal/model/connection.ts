import mongoose from "mongoose";


mongoose.connect('mongodb://localhost:27017/cp-db', {
    user: 'root',
    pass: 'example',
    minPoolSize: 10,
    maxPoolSize: 20,
});

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
});

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
});
