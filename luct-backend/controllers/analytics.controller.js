// server/controllers/analytics.controller.js
const pool = require('../config/db');

const getStudentAnalytics = async (req, res) => {
  try {
    // 1. Students per faculty
    const [facultyCounts] = await pool.execute(`
      SELECT faculty, COUNT(*) as student_count
      FROM users
      WHERE role = 'student'
      GROUP BY faculty
      ORDER BY student_count DESC
    `);

    // 2. Students per course (via classes)
    const [courseCounts] = await pool.execute(`
      SELECT 
        co.course_name,
        co.faculty,
        SUM(c.total_registered_students) as total_students
      FROM classes c
      JOIN courses co ON c.course_id = co.id
      GROUP BY co.id, co.course_name, co.faculty
      ORDER BY total_students DESC
      LIMIT 10
    `);

    res.json({
      byFaculty: facultyCounts,
      byCourse: courseCounts
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to load analytics' });
  }
};

module.exports = { getStudentAnalytics };