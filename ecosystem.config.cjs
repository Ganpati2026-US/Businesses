// Production process manager config for BitByte
// Before running: npm run build:client && npm run build:server
module.exports = {
  apps: [
    {
      name: 'bitbyte-production-backend',
      script: './node_modules/.bin/tsx',
      args: 'server/index.ts',
      instances: 1, // Runs a single instance to conserve RAM on cheap EC2 instances (t2/t3.micro)
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '350M', // Automatically restarts if memory usage exceeds 350MB (guard against memory leaks)
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        API_ONLY: 'true'
      }
    }
  ]
};
