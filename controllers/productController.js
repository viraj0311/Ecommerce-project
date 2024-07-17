const pool = require('../config/database');

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const [result] = await pool.query(
      'INSERT INTO products (name, description, price) VALUES (?, ?, ?)',
      [name, description, price]
    );
    res.status(201).json({ message: 'Product created successfully', data: { id: result.insertId, name, description, price } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json({ message: 'Products retrieved successfully', data: rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.query.id]);
    if (rows.length > 0) {
      res.json({ message: 'Product retrieved successfully', data: rows[0] });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const [result] = await pool.query(
      'UPDATE products SET name = ?, description = ?, price = ? WHERE id = ?',
      [name, description, price, req.query.id]
    );
    if (result.affectedRows > 0) {
      res.json({ message: 'Product updated successfully', data: { id: req.params.id, name, description, price } });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.query.id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Product deleted successfully', data: null });
    } else {
      res.status(404).json({ message: 'Product not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
