const express = require('express');
const router = express.Router();
const { getAllTeamsWithRegistrations } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/teams', protect, admin, getAllTeamsWithRegistrations);

module.exports = router;
