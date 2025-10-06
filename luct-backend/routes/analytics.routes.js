// server/routes/analytics.routes.js
const express = require('express');
const { getStudentAnalytics } = require('../controllers/analytics.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Only PL, PRL, or admin can view analytics
router.get('/', authenticateToken, authorizeRole('pl', 'prl'), getStudentAnalytics);

module.exports = router;