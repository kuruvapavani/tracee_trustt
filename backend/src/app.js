const express = require('express');
const cors = require('cors'); // If your frontend is on a different origin

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require("./routes/adminRoutes");
const errorHandler = require('./middlewares/errorHandler'); // Centralized error handler

const app = express();

// Middlewares
app.use(express.json()); // Body parser for JSON requests
app.use(cors()); // Enable CORS for all origins (adjust for production environment for security)

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use("/api/admin", adminRoutes);


// Error handling middleware (should be the last middleware)
app.use(errorHandler);

module.exports = app;