const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

connectDB();

app.use('/api/auth', require('./routes/auth'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/recommendations', require('./routes/recommendations'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));