const express = require('express');
const userRoutes = require('./routes/userRoute');
const productRoutes = require('./routes/productRoute');
require('dotenv').config();
const pool = require('./config/database');

const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
pool.getConnection();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));