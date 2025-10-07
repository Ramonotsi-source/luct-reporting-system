const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const { getUsersByRole } = require('../controllers/user.controller');

const router = express.Router();

router.get('/', authenticateToken, getUsersByRole);

module.exports = router;