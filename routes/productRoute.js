const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');

router.post('/addProduct', authenticateToken, isAdmin, productController.createProduct);
router.get('/getAllProduct', authenticateToken, productController.getAllProducts);
router.get('/getProductById', authenticateToken, productController.getProductById);
router.put('/updateProduct', authenticateToken, isAdmin, productController.updateProduct);
router.delete('/deleteProduct', authenticateToken, isAdmin, productController.deleteProduct);

module.exports = router;