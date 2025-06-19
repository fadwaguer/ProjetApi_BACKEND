const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const configurationRoutes = require('./routes/configurationRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const componentRoutes = require('./routes/componentRoutes');
const authRoutes = require('./routes/authRoutes');
const setupSwagger = require('./config/swagger');

const corsOptions = {
  origin: 'http://localhost:4200',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

// Configure Swagger
setupSwagger(app);

// Routes
app.use('/api/configurations', configurationRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/prices', require('./routes/priceRoutes'));

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
