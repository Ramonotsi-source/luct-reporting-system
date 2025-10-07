const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { addCourse, getAllCourses, assignLecturer } = require('../controllers/course.controller');

const router = express.Router();

// POST /api/courses - Add new course
router.post('/', authenticateToken, authorizeRole('pl'), addCourse);

// GET /api/courses - Get all courses
router.get('/', authenticateToken, authorizeRole('prl', 'pl'), getAllCourses);

// POST /api/courses/assign - Assign lecturer to class
router.post('/assign', authenticateToken, authorizeRole('pl'), assignLecturer);

module.exports = router;