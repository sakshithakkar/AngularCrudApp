const pool = require('../db/connection');

exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.name, p.price, p.category_id, c.name AS category_name,
             p.created_by, p.created_at, p.updated_at
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.created_by = u.id
      ORDER BY p.id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, price, category_id } = req.body;
    if (!name || price == null) return res.status(400).json({ message: 'name and price required' });

    // optional: ensure category exists if provided
    if (category_id) {
      const [crows] = await pool.query('SELECT id FROM categories WHERE id = ?', [category_id]);
      if (!crows.length) return res.status(400).json({ message: 'Provided category does not exist' });
    }

    const [result] = await pool.query(
      'INSERT INTO products (name, price, category_id, created_by) VALUES (?, ?, ?, ?)',
      [name, price, category_id || null, userId]
    );

    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { name, price, category_id } = req.body;

    const [rows] = await pool.query('SELECT created_by FROM products WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Product not found' });
    if (rows[0].created_by !== userId) return res.status(403).json({ message: 'You are not allowed to update this product' });

    // check category exist if provided
    if (category_id) {
      const [crows] = await pool.query('SELECT id FROM categories WHERE id = ?', [category_id]);
      if (!crows.length) return res.status(400).json({ message: 'Provided category does not exist' });
    }

    await pool.query(
      'UPDATE products SET name = COALESCE(?, name), price = COALESCE(?, price), category_id = COALESCE(?, category_id), updated_by = ? WHERE id = ?',
      [name || null, price == null ? null : price, category_id || null, userId, id]
    );

    res.json({ message: 'Product updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [rows] = await pool.query('SELECT created_by FROM products WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Product not found' });
    if (rows[0].created_by !== userId) return res.status(403).json({ message: 'Not allowed' });

    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
