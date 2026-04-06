const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Load env vars
dotenv.config();

// Verify critical env vars
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.error(`FATAL ERROR: ${varName} is not defined.`);
  }
});

if (!process.env.JWT_SECRET || !process.env.DATABASE_URL) {
  console.warn('WARNING: JWT_SECRET or DATABASE_URL is not defined. Some features may fail.');
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

const app = express();

// Security Middleware
app.use(helmet()); // Sets various HTTP headers for security

// CORS Configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:8080',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());

// Rate Limiting for Auth Routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});


// Routes
app.use('/api', require('../server/routes/api'));
app.use('/api/auth', authLimiter, require('../server/routes/authRoutes'));
app.use('/api/team', require('../server/routes/teamRoutes'));

app.use('/api/registration', require('../server/routes/registrationRoutes'));
app.use('/api/admin', require('../server/routes/adminRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Express Error Catch:', err);
  res.status(500).json({ message: 'Server Error', detail: err.message });
});


const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
