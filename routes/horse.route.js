const express = require('express');
const router = express.Router();
const { authToken } = require('../middleware/verifyJwt.middleware');

router
  .route('/api/horse')
  .get(authToken, (req, res) => {
    console.log(req.user);
    res.send('GET Horse');
  })
  .post((req, res) => {
    res.send('POST HORSE');
  });

module.exports = router;
