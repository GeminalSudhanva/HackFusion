const express = require('express');
const router = express.Router();
const { getAllTeamsWithRegistrations, scanFoodUser, verifyPayment, toggleKitReceived, getTeamScanDetails, getUserScanDetails } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/teams', protect, admin, getAllTeamsWithRegistrations);
router.get('/team-scan/:teamId', protect, admin, getTeamScanDetails);
router.get('/user-scan/:userId', protect, admin, getUserScanDetails);
router.post('/scan-food/:userId', protect, admin, scanFoodUser);
router.put('/verify-payment/:registrationId', protect, admin, verifyPayment);
router.patch('/kit/:userId', protect, admin, toggleKitReceived);

module.exports = router;
