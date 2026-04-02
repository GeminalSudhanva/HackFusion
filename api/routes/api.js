const express = require('express');
const router = express.Router();

// @route   GET /api/test
// @desc    Tests api route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ message: 'API is working correctly' });
});

module.exports = router;
