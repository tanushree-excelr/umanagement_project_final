const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/userRoutes');
const mongoose = require('mongoose');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/api', userRoutes);

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; // export for testing
module.exports.mongoose = mongoose;
