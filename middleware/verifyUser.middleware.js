const User = require('../models/user.model');

const checkUsername = async (username) => {
  return await User.findOne({ username: username });
};

const checkEmail = async (email) => {
  return await User.findOne({ email: email });
};

module.exports = { checkUsername, checkEmail };
