const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { submitRating } = require('../controllers/rating.controller');

const router = express.Router();

router.post('/', authenticateToken, authorizeRole('student'), submitRating);

module.exports = router;