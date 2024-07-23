const xlsx = require('xlsx');
const pool = require('../config/database');

exports.importProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const products = xlsx.utils.sheet_to_json(sheet);

    const importedProducts = [];

    for (let product of products) {
      const [result] = await pool.query(
        'INSERT INTO products (name, description, price) VALUES (?, ?, ?)',
        [product.name, product.description, product.price]
      );
      importedProducts.push({ id: result.insertId, ...product });
    }

    res.status(201).json({ 
      message: 'Products imported successfully', 
      data: importedProducts 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};