const jwt = require('jsonwebtoken');

const authToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) res.send(401).json({ message: 'Not authorized' });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    if (err) res.status(401).send({ message: 'Not authorized 401' });
    else {
      console.log(data);
      req.user = data;
      next();
    }
  });
};

module.exports = { authToken };
