require('dotenv').config({ path: './backend/.env' });
const { defineConfig, env } = require('prisma/config');

module.exports = defineConfig({
  schema: './backend/prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
