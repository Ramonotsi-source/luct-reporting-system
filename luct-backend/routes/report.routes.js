const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { submitReport, getReports, getClassesForLecturer, addFeedback } = require('../controllers/report.controller');

const router = express.Router();

router.post('/', authenticateToken, authorizeRole('lecturer'), submitReport);
router.get('/', authenticateToken, getReports);
router.get('/my-classes', authenticateToken, authorizeRole('lecturer'), getClassesForLecturer);
router.post('/:id/feedback', authenticateToken, authorizeRole('prl'), addFeedback);

module.exports = router;