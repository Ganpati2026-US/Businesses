import mongoose from 'mongoose';

// Ensure all Mongoose models are registered to avoid MissingSchemaError
import '../models/User';
import '../models/Restaurant';
import '../models/Table';
import '../models/MenuItem';
import '../models/Order';

// Apply DNS fix only on local development (macOS c-ares resolver issue)
if (typeof process !== 'undefined' && process.platform === 'darwin') {
  try {
    // Dynamic import to avoid bundling dns in Edge/serverless
    const dns = require('dns');
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {
    // ignore — dns module may not be available in all runtimes
  }
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxIdleTimeMS: 10000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
