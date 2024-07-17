const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [roleResult] = await pool.query('SELECT id FROM roles WHERE name = ?', [role]);
    if (roleResult.length === 0) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, roleResult[0].id]
    );

    const  [user] = await pool.query(
      'SELECT u.id, u.username, u.email, r.name as role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'User registered successfully',
      data: user[0]
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await pool.query(
      'SELECT u.id, u.username, u.email, u.password, r.name as role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Logged in successfully',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
