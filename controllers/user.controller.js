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
  User.findOne({ username: username }).exec((err, user) => {
    if (err) res.status(500).send({ message: 'Internal server error' });
    if (!user) res.status(400).send({ message: 'Invalid username/password' });
    const passwordVerify = bcrypt.compareSync(password, user.password);
    if (!passwordVerify)
      res.status(400).send({ message: 'Invalid username/password' });
    else {
      // console.log(user._id);
      const ip =
        req.headers['x-forwarded-for']?.split(',').shift() ||
        req.socket?.remoteAddress;
      try {
        const data = refreshToken.generateToken(user, ip);
        res.status(200).send(data);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Internal server error' });
      }
    }
  });
};

module.exports = { register, login };
