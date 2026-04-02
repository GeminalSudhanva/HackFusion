require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('DATABASE_URL is missing!');
} else {
  const maskedUrl = connectionString.substring(0, 15) + '...';
  console.log('Initializing Prisma with masked URL:', maskedUrl);
}

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ 
  adapter,
  log: ['query', 'info', 'warn', 'error']
});

module.exports = prisma;
