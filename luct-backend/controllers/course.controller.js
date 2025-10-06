const pool = require('../config/db');

const addCourse = async (req, res) => {
  const { course_name, course_code, faculty } = req.body;
  if (!course_name || !course_code || !faculty) {
    return res.status(400).json({ error: 'All fields required' });
  }
  try {
    const [result] = await pool.execute(
      'INSERT INTO courses (course_name, course_code, faculty, pl_id) VALUES (?, ?, ?, ?)',
      [course_name, course_code, faculty, req.user.id]
    );
    res.status(201).json({
      message: 'Course added successfully',
      courseId: result.insertId
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Course code already exists' });
    }
    res.status(500).json({ error: 'Failed to add course' });
  }
};

const assignLecturer = async (req, res) => {
  const {
    course_id,
    lecturer_id,
    class_name,
    venue,
    scheduled_time,
    day_of_week,
    total_registered_students
  } = req.body;

  if (!course_id || !lecturer_id || !class_name || !venue || !scheduled_time || !day_of_week || !total_registered_students) {
    return res.status(400).json({ error: 'All fields required' });
  }

  try {
    const [result] = await pool.execute(
      `INSERT INTO classes 
       (course_id, lecturer_id, class_name, venue, scheduled_time, day_of_week, total_registered_students) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        course_id,
        lecturer_id,
        class_name,
        venue,
        scheduled_time,
        day_of_week,
        total_registered_students
      ]
    );
    
    res.status(201).json({
      message: 'Lecturer assigned successfully',
      classId: result.insertId
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign lecturer' });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
        c.*,
        u.name AS pl_name
       FROM courses c
       LEFT JOIN users u ON c.pl_id = u.id
       WHERE c.faculty = ?`,
      [req.user.faculty]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

module.exports = { addCourse, assignLecturer, getAllCourses };