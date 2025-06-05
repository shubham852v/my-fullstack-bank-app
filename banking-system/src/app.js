const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const bankerRoutes = require('./routes/bankerRoutes');
const customerRoutes = require('./routes/customerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/banker', bankerRoutes);
app.use('/api/customer', customerRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Banking System API!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
