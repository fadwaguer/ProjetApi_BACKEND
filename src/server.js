const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const partnerRoutes = require('./routes/partnerRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const componentRoutes = require('./routes/componentRoutes');
const authRoutes = require('./routes/authRoutes');
const setupSwagger = require('./config/swagger');

const app = express();
app.use(express.json());

// Configure Swagger
setupSwagger(app);

// Routes
app.use('/api/partners', partnerRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/auth', authRoutes);

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
