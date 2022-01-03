require('dotenv').config();
const express = require('express');
const horseRouter = require('./routes/horse.route');
const userRouter = require('./routes/user.route');
const refreshTokenRouter = require('./routes/refreshToken.route');
const app = express();
const port = process.env.PORT;
const cors = require('cors');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(horseRouter);
app.use(userRouter);
app.use(refreshTokenRouter);

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
