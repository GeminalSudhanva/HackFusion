const express = require('express');
const router = express.Router();
const {
  createTeam,
  joinTeamViaCode,
  sendJoinRequest,
  respondToRequest,
  getMyTeam,
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

// All boundaries require JWT
router.post('/create', protect, createTeam);
router.post('/join', protect, joinTeamViaCode);
router.post('/request', protect, sendJoinRequest);
router.post('/respond', protect, respondToRequest);
router.get('/my-team', protect, getMyTeam);

module.exports = router;
