import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Define the root path
const rootPath = path.resolve(process.cwd(), '.env.local');

if (fs.existsSync(rootPath)) {
    dotenv.config({ path: rootPath });
    console.log('Environment variables loaded from:', rootPath);
} else {
    console.log('No .env.local file found. Relying on system/process environment variables.');
}

if (!process.env.MONGODB_URI) {
    console.warn('WARNING: MONGODB_URI is not defined in the environment.');
}
