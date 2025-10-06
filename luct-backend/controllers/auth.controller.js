const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const register = async (req, res) => {
  const { name, email, password, faculty, role, course, year } = req.body;

  // ✅ Password validation
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  if (password.length > 20) {
    return res.status(400).json({ error: 'Password must be less than 20 characters' });
  }

  // ✅ Basic field validation
  if (!name || !email || !faculty || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // ✅ Student-specific validation
  if (role === 'student') {
    if (!course) {
      return res.status(400).json({ error: 'Course is required for students' });
    }
    if (!year) {
      return res.status(400).json({ error: 'Year of study is required for students' });
    }
    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum) || yearNum < 1 || yearNum > 4) {
      return res.status(400).json({ error: 'Year must be between 1 and 4' });
    }
    // Diploma = max Year 3, Degree = max Year 4
    const isDegree = course.toLowerCase().includes('degree');
    if (!isDegree && yearNum > 3) {
      return res.status(400).json({ error: 'Diploma programs only go up to Year 3' });
    }
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    if (role === 'student') {
      // Insert student with course & year
      const [result] = await pool.execute(
        `INSERT INTO users (name, email, password, role, faculty, course, year) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, email, hashed, role, faculty, course, year]
      );
      res.status(201).json({ message: 'Student registered', userId: result.insertId });
    } else {
      // Insert staff (no course/year)
      const [result] = await pool.execute(
        `INSERT INTO users (name, email, password, role, faculty) 
         VALUES (?, ?, ?, ?, ?)`,
        [name, email, hashed, role, faculty]
      );
      res.status(201).json({ message: 'User registered', userId: result.insertId });
    }
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!password || password.length > 20) {
    return res.status(400).json({ error: 'Password must be less than 20 characters' });
  }

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(400).json({ error: 'User not found' });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, faculty: user.faculty },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ Include course & year for students in login response
    const userResponse = {
      id: user.id,
      name: user.name,
      role: user.role,
      faculty: user.faculty
    };
    if (user.role === 'student') {
      userResponse.course = user.course;
      userResponse.year = user.year;
    }

    res.json({
      token,
      user: userResponse
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};

module.exports = { register, login };