const pool = require('../config/db');

const submitRating = async (req, res) => {
  const { lecture_report_id, rating, comment } = req.body;
  const student_id = req.user.id;

  try {
    const [result] = await pool.execute(
      'INSERT INTO lecture_ratings (student_id, lecture_report_id, rating, comment) VALUES (?, ?, ?, ?)',
      [student_id, lecture_report_id, rating, comment || null]
    );
    res.status(201).json({ message: 'Rating submitted', ratingId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { submitRating };