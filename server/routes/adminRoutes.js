const express = require('express');
const router = express.Router();
const { getAllTeamsWithRegistrations, scanFoodTeam } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/teams', protect, admin, getAllTeamsWithRegistrations);
router.post('/scan-food/:teamId', protect, admin, scanFoodTeam);

module.exports = router;
