import mongoose from 'mongoose';

// Use environment variable only, remove hardcoded fallback for production
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * Global is used here to maintain connection state across hot reloads
 * in development.
 */
let isConnected = false;

export const connectToDatabase = async () => {
  // If already connected, return
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    // If there's an existing connection but it's not ready, disconnect first
    if (mongoose.connections[0].readyState) {
      await mongoose.disconnect();
    }

    const connection = await mongoose.connect(MONGODB_URI, {
      bufferCommands: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log('MongoDB connected successfully');
    return connection;
  } catch (error) {
    isConnected = false;
    console.error('Error connecting to MongoDB:', error);
    throw new Error(`Unable to connect to database: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Handle connection errors after initial connection
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  isConnected = false;
});

// Handle disconnection
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  isConnected = false;
});

export default connectToDatabase; 