const pool = require('../db/connection');
const bcrypt = require('bcrypt');

exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, email, created_at, updated_at FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// optional: get single user
exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT id, email, created_at, updated_at FROM users WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// update user - requires authentication check in route (we'll allow user to update their own record)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password } = req.body;

    // optional: check that req.user.id === id if route protected
    // we'll expect route to be protected and caller to check ownership

    let hashed = null;
    if (password) hashed = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'UPDATE users SET email = COALESCE(?, email), password = COALESCE(?, password) WHERE id = ?',
      [email || null, hashed || null, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
