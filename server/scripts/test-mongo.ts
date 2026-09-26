import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const uri = process.env.MONGODB_URI;
console.log('Testing connection to:', uri ? uri.split('@')[1] : 'undefined URI');

dns.setServers(['8.8.8.8', '1.1.1.1']);

async function testConnection() {
  try {
    await mongoose.connect(uri!, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });
    console.log('✅ Successfully connected to MongoDB Atlas!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB Atlas:');
    console.error(error);
    process.exit(1);
  }
}

testConnection();
