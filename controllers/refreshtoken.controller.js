const RefreshToken = require('../models/refreshToken.model');
const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = process.env;
const User = require('../models/user.model');

const checkExpired = (token) => {
  return token.expiryDate.getTime() < new Date().getTime();
};

exports.generateToken = (user, ip) => {
  let expiredAt = new Date();
  expiredAt.setSeconds(expiredAt.getSeconds() + 120);

  let _refreshToken = new RefreshToken({
    userId: user._id,
    expiryDate: expiredAt.getTime(),
  });
  _refreshToken.save();

  const token = jwt.sign(
    { username: user.username, role: user.role, ip_origin: ip },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: 60,
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

exports.newToken = async (req, res) => {
  const refreshToken = req.headers.cookie.split(';')[2].split('=')[1];
  const accessToken = req.headers.cookie.split(';')[3].split('=')[1];
  console.log(refreshToken);
  console.log(accessToken);
  const reqToken = refreshToken;
  if (!reqToken) {
    return res.status(403).json({ message: 'No refresh token provided' });
  }
  try {
    let refreshToken = await RefreshToken.findOne({
      where: { token: reqToken },
    });
    if (!refreshToken) {
      res.status(403).json({ message: 'Invalid refresh token' });
      return;
    }
    if (checkExpired(refreshToken)) {
      RefreshToken.deleteOne({ where: { id: refreshToken.id } });

      res.status(403).json({
        message: 'Refresh token expired.',
      });
      return;
    }
    try {
      decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    } catch (e) {
      return res.status(401).send({ message: 'Unauthorized' });
    }
    User.findOne({ username: decoded.username }).exec((err, user) => {
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
          expiresIn: 60,
        }
      );
      res.cookie('accessToken', newToken, { httpOnly: true });
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
