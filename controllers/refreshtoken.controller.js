const RefreshToken = require('../models/refreshToken.model');
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = process.env;
const User = require('../models/user.model');

const findUser = async (reqToken) => {
  let refreshToken = await RefreshToken.findOne({
    where: { token: reqToken },
  });
  const user = await User.findById(refreshToken.userId);
  return user;
};

const checkExpired = (token) => {
  // console.log(token.expiryDate.getTime());
  // console.log(new Date().getTime());
  // console.log(token.expiryDate < new Date());
  return token.expiryDate.getTime() < new Date().getTime();
};

exports.generateToken = (user, ip) => {
  let expiredAt = new Date();
  expiredAt.setSeconds(expiredAt.getSeconds() + 15);

  let _refreshToken = new RefreshToken({
    userId: user._id,
    expiryDate: expiredAt.getTime(),
  });
  _refreshToken.save();

  const token = jwt.sign(
    { username: user.username, role: user.role, ip_origin: ip },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: 10,
    }
  );

  const data = {
    username: user.username,
    role: user.role,
    accessToken: token,
    refreshToken: _refreshToken.token,
  };
  return data;
};

exports.deleteRefreshToken = async (token) => {
  if (!token) {
    return res.status(403).json({ message: 'No refresh token provided' });
  }
  try {
    let refreshToken = await RefreshToken.findOne({
      where: { token: token },
    });
    RefreshToken.findByIdAndDelete(refreshToken._id, (err, data) => {
      if (err) res.status(500).send({ message: 'Internal server error' });
      // console.log(data);
      return data;
    });
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.newToken = async (req, res) => {
  // console.log(req.headers);
  try {
    var refreshToken = req.headers.cookie.split(';')[2].split('=')[1] || null;
  } catch (err) {
    return res.status(400).send({ message: 'Invalid refresh token' });
  }
  console.log(refreshToken);
  const reqToken = refreshToken;
  if (!reqToken) {
    return res.status(403).json({ message: 'No refresh token provided' });
  }
  try {
    let refreshToken = await RefreshToken.findOne({
      where: { token: reqToken },
    });
    if (!refreshToken) {
      res.clearCookie('refreshToken');
      return res.status(403).json({ message: 'Invalid refresh token' });
    }
    console.log(refreshToken);
    if (checkExpired(refreshToken)) {
      res.clearCookie('refreshToken');
      console.log(reqToken);
      RefreshToken.findByIdAndDelete(refreshToken._id, (err, data) => {
        if (err) res.status(500).send({ message: 'Internal server error' });
        console.log(data);
      });
      console.log(1);

      return res.status(403).json({
        message: 'Refresh token expired.',
      });
    }
    try {
      var user = await findUser(reqToken);
    } catch (e) {
      console.log(e);
      // console.log(refreshToken.token);
      return res.status(401).send({ message: 'Unauthorized' });
    }
    User.findOne({ username: user.username }).exec((err, user) => {
      if (err)
        return res.status(500).send({ message: 'internal server error' });
      const ip =
        req.headers['x-forwarded-for']?.split(',').shift() ||
        req.socket?.remoteAddress;
      const newToken = jwt.sign(
        {
          username: user.username,
          role: user.role,
          ip_origin: ip,
        },
        ACCESS_TOKEN_SECRET,
        {
          expiresIn: 10,
        }
      );
      return res.status(200).json({
        accessToken: newToken,
        refreshToken: refreshToken.token,
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err });
  }
};
