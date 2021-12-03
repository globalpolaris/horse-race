require('dotenv').config();
const express = require('express');
const horseRouter = require('./routes/horse.route');
const app = express();
const port = process.env.PORT;

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

app.use(horseRouter);

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});
