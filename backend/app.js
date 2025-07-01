const express = require('express');

const app = express();
const authRouter = require('./routes/authRoutes');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [process.env.FRONTEND_URL],
  credentials: true
}))

app.use('/api/auth', authRouter);

app.use('/', (req, res) => {
  res.status(200).json({
    data: 'JWTauth Server is running successfully'
  });
});

module.exports = app;