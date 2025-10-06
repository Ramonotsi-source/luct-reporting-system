const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { exportReports } = require('../controllers/export.controller');

const router = express.Router();

router.get('/reports', authenticateToken, exportReports);

module.exports = router;