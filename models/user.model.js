const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { Schema } = mongoose;
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'member',
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
