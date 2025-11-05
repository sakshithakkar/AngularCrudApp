const pool = require('../db/connection');
const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });


exports.getAllProducts = async (req, res) => {
  try {
    // Extract query params
    const {
      page = 1,
      limit = 10,
      sort = 'desc',           // 'asc' or 'desc'
      search = '',             // search term for product or category
    } = req.query;

    const offset = (page - 1) * limit;

    // Base query
    let baseQuery = `
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.created_by = u.id
      WHERE 1=1
    `;

    // Apply search if provided
    const queryParams = [];
    if (search) {
      baseQuery += ` AND (p.name LIKE ? OR c.name LIKE ?)`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    // Count total records
    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total ${baseQuery}`,
      queryParams
    );
    const total = countRows[0].total;

    // Get paginated records
    const [rows] = await pool.query(
      `
      SELECT p.id, p.name, p.price, p.category_id, c.name AS category_name,
             p.created_by, p.created_at, p.updated_at
      ${baseQuery}
      ORDER BY p.price ${sort.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'}
      LIMIT ? OFFSET ?
      `,
      [...queryParams, parseInt(limit), parseInt(offset)]
    );

    // Return paginated response
    res.json({
      data: rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (err) {
    console.error(err);
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

exports.uploadProducts = async (req, res) => {
 try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const products = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        products.push(row);
      })
      .on("end", async () => {
        const insertPromises = products.map((p) =>
          pool.query(
            `INSERT INTO products (name, price, category_id, created_by) VALUES (?, ?, ?, ?)`,
            [p.name, p.price, p.category_id, req.user.id]
          )
        );
        await Promise.all(insertPromises);
        fs.unlinkSync(filePath); // clean up file after import
        res.json({ message: "Products uploaded successfully", count: products.length });
      });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Error uploading products" });
  }
}
