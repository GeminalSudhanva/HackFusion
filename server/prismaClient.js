const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client using standard Node.js native engine
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

module.exports = prisma;

