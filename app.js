require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const authRoutes = require('./routes/authRoutes');
const balanceSheet = require('./services/balanceSheet');
const friendRoutes = require('./routes/friendRoutes');
const { authenticateToken } = require('./middlewares/auth');

// Middleware
app.use(express.json());

// Routes
app.use('/api', authRoutes); // Authentication routes
app.use('/api', authenticateToken, userRoutes); // Protected routes
app.use('/api', authenticateToken, expenseRoutes);
app.use("/api",friendRoutes);

// Download Balance Sheet (Authenticated route)
app.get('/api/balance-sheet', authenticateToken, balanceSheet.generateBalanceSheet);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Could not connect to MongoDB', error));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
