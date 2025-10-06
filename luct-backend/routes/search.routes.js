const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { searchReports } = require('../controllers/search.controller');

const router = express.Router();

router.get('/', authenticateToken, searchReports);

module.exports = router;