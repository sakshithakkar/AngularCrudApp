const pool = require('../db/connection');

exports.getAllCategories = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT c.id, c.name, c.description, c.created_by, c.created_at, c.updated_at
      FROM categories c
      JOIN users u ON c.created_by = u.id
      ORDER BY c.id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'name required' });

    const [result] = await pool.query(
      'INSERT INTO categories (name, description, created_by) VALUES (?, ?, ?)',
      [name, description || null, userId]
    );

    const insertedId = result.insertId;
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [insertedId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    // handle duplicate name gracefully
    if (err && err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Category name must be unique' });
    res.status(500).json({ message: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, description } = req.body;

    // ensure category exists and belongs to the user (ownership)
    const [rows] = await pool.query('SELECT created_by FROM categories WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Category not found' });

    if (rows[0].created_by !== userId) {
      return res.status(403).json({ message: 'You are not allowed to update this category' });
    }

    const [result] = await pool.query(
      'UPDATE categories SET name = COALESCE(?, name), description = COALESCE(?, description), updated_by = ? WHERE id = ?',
      [name || null, description || null, userId, id]
    );

    res.json({ message: 'Category updated' });
  } catch (err) {
    if (err && err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'Category name must be unique' });
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const [rows] = await pool.query('SELECT created_by FROM categories WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Category not found' });
    if (rows[0].created_by !== userId) return res.status(403).json({ message: 'Not allowed' });

    const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
