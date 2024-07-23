const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const importController = require('../controllers/importController');
const { authenticateToken, isAdmin } = require('../middlewares/authMiddleware');
const multer = require('multer');

const upload = multer();

router.post('/addProduct', authenticateToken, isAdmin, productController.createProduct);
router.get('/getAllProduct', authenticateToken, productController.getAllProducts);
router.get('/getProductById', authenticateToken, productController.getProductById);
router.put('/updateProduct', authenticateToken, isAdmin, productController.updateProduct);
router.delete('/deleteProduct', authenticateToken, isAdmin, productController.deleteProduct);

// New route for importing products
router.post('/importProducts', authenticateToken, isAdmin, upload.single('file'), importController.importProducts);

module.exports = router;