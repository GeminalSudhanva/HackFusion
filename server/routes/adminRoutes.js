const express = require('express');
const router = express.Router();
const { getAllTeamsWithRegistrations, scanFoodUser, verifyPayment, toggleKitReceived } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/teams', protect, admin, getAllTeamsWithRegistrations);
router.post('/scan-food/:userId', protect, admin, scanFoodUser);
router.put('/verify-payment/:registrationId', protect, admin, verifyPayment);
router.patch('/kit/:userId', protect, admin, toggleKitReceived);

module.exports = router;
