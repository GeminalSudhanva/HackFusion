const express = require('express');
const router = express.Router();
const { registerTeam, getMyRegistration } = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', protect, registerTeam);
router.get('/my-registration', protect, getMyRegistration);

module.exports = router;
