const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const passport = require('passport');
require('dotenv').config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Initialize middleware
app.use(cors());
app.use(express.json({ extended: false }));

// Passport middleware
app.use(passport.initialize());
require('./config/passport')(passport);

// Define routes
app.use('/api/auth', require('./routes/api/auth'));

// Define a basic route for testing
app.get('/', (req, res) => {
  res.send('HealWise API is running');
});

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});