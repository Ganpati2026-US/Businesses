import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
    turbopack: {
        root: resolve(__dirname, '..'),
    },
};

export default nextConfig;
