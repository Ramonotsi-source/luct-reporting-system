const pool = require('../config/db');

const getUsersByRole = async (req, res) => {
  const { role } = req.query;
  
  try {
    let query = 'SELECT id, name, email, role, faculty FROM users';
    let params = [];
    
    if (role) {
      query += ' WHERE role = ?';
      params = [role];
    }
    
    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

module.exports = { getUsersByRole };