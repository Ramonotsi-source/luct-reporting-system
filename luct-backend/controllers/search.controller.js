// server/controllers/search.controller.js
const pool = require('../config/db');

const searchReports = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query "q" is required' });
  }

  try {
    const searchTerm = `%${q}%`;
    const [reports] = await pool.execute(
      `SELECT 
        lr.id,
        lr.date_of_lecture,
        lr.week_of_reporting,
        lr.topic_taught,
        c.venue,
        co.course_name,
        co.course_code,
        u.name AS lecturer_name
      FROM lecture_reports lr
      INNER JOIN classes c ON lr.class_id = c.id
      INNER JOIN courses co ON c.course_id = co.id
      INNER JOIN users u ON c.lecturer_id = u.id
      WHERE 
        lr.topic_taught LIKE ? OR
        co.course_name LIKE ? OR
        co.course_code LIKE ? OR
        u.name LIKE ? OR
        c.venue LIKE ?
      ORDER BY lr.date_of_lecture DESC`,
      [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]
    );

    res.json({ reports });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Failed to search reports' });
  }
};  

module.exports = { searchReports };