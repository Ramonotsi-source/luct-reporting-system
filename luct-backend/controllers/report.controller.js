const pool = require('../config/db');

const submitReport = async (req, res) => {
  const {
    class_id,
    week_of_reporting,
    date_of_lecture,
    topic_taught,
    learning_outcomes,
    actual_students_present,
    recommendations
  } = req.body;

  try {
    const [result] = await pool.execute(
      `INSERT INTO lecture_reports 
       (class_id, week_of_reporting, date_of_lecture, topic_taught, learning_outcomes, 
        actual_students_present, recommendations) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        class_id,
        week_of_reporting,
        date_of_lecture,
        topic_taught,
        learning_outcomes || null,
        actual_students_present,
        recommendations || null
      ]
    );
    res.status(201).json({
      message: 'Lecture report submitted successfully',
      reportId: result.insertId
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit report' });
  }
};

const getReports = async (req, res) => {
  const { role, id, faculty } = req.user;
  let query = '';
  let params = [];

  if (role === 'lecturer') {
    query = `
      SELECT 
        lr.*,
        c.class_name,
        co.course_name,
        co.course_code,
        u.name AS lecturer_name,
        c.venue,
        c.scheduled_time,
        c.total_registered_students
      FROM lecture_reports lr
      JOIN classes c ON lr.class_id = c.id
      JOIN courses co ON c.course_id = co.id
      JOIN users u ON c.lecturer_id = u.id
      WHERE c.lecturer_id = ?
    `;
    params = [id];
  } else {
    query = `
      SELECT 
        lr.*,
        c.class_name,
        co.course_name,
        co.course_code,
        u.name AS lecturer_name,
        c.venue,
        c.scheduled_time,
        c.total_registered_students
      FROM lecture_reports lr
      JOIN classes c ON lr.class_id = c.id
      JOIN courses co ON c.course_id = co.id
      JOIN users u ON c.lecturer_id = u.id
      WHERE co.faculty = ?
    `;
    params = [faculty];
  }

  try {
    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
};

const getClassesForLecturer = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
        c.id,
        c.class_name,
        co.course_name,
        co.course_code,
        c.venue,
        c.scheduled_time,
        c.day_of_week,
        c.total_registered_students
       FROM classes c
       JOIN courses co ON c.course_id = co.id
       WHERE c.lecturer_id = ?`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch classes' });
  }
};

const addFeedback = async (req, res) => {
  const { id } = req.params;
  const { feedback } = req.body;

  try {
    await pool.execute(
      'UPDATE lecture_reports SET prl_feedback = ? WHERE id = ?',
      [feedback, id]
    );
    res.json({ message: 'Feedback added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add feedback' });
  }
};

module.exports = { submitReport, getReports, getClassesForLecturer, addFeedback };