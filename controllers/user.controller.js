const User = require('../models/user.model');
const verifyUser = require('../middleware/verifyUser.middleware');
const bcrypt = require('bcryptjs');
const refreshToken = require('../controllers/refreshtoken.controller');
const register = async (req, res) => {
  const salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUND));
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({
      message: 'Please provide username, email, and password',
    });
  }

  const isUsername = await verifyUser.checkUsername(username);
  console.log(isUsername);
  if (isUsername) {
    return res.status(400).json({
      message: 'Username already exists',
    });
  }
  const isEmail = await verifyUser.checkEmail(email);

  if (isEmail) {
    return res.status(400).json({ message: 'Email already exists' });
  }
  const newUser = new User({
    username: username,
    email: email,
    password: bcrypt.hashSync(password, salt),
  });
  newUser.save((err, data) => {
    if (err) res.status(500).send({ message: err.message });
    console.log(data);
    return res.status(201).send({
      message:
        'Registration completed, you can now login with your username and password',
    });
  });
};

const login = (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);
  console.log(username);
  console.log(password);
  if (!username || !password) {
    return res.status(400).json({
      message: 'Please provide username and password',
    });
  }
  User.findOne({ username: username }).exec((err, user) => {
    if (err) return res.status(500).send({ message: 'Internal server error' });
    if (!user)
      return res.status(400).send({ message: 'Invalid username/password' });
    const passwordVerify = bcrypt.compareSync(password, user.password);
    if (!passwordVerify)
      return res.status(400).send({ message: 'Invalid username/password' });
    else {
      // console.log(user._id);
      const ip =
        req.headers['x-forwarded-for']?.split(',').shift() ||
        req.socket?.remoteAddress;
      try {
        const data = refreshToken.generateToken(user, ip);
        res.cookie('refreshToken', data.refreshToken, { httpOnly: true });
        return res.status(200).send(data);
      } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Internal server error' });
      }
    }
  });
};

const logout = async (req, res) => {
  const token = req.headers.cookie.split(';')[2].split('=')[1] || null;
  const isDeleted = refreshToken.deleteRefreshToken(token);
  if (isDeleted === null) {
    return res.status(400).send({ message: 'Invalid refresh token' });
  }
  res.clearCookie('refreshToken');
  return res.status(200).send({ message: 'Logout success' });
};

module.exports = { register, login, logout };
