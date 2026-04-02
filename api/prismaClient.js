require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('FATAL: DATABASE_URL is undefined in process.env!');
}

const maskedUrl = connectionString.substring(0, 15) + '...' + connectionString.substring(connectionString.length - 10);
console.log(`Prisma Init: URL Length=${connectionString.length}, Preview="${maskedUrl}"`);

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ 
  adapter,
  log: ['query', 'info', 'warn', 'error']
});

module.exports = prisma;
