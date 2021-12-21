const express = require('express');
const router = express.Router();
const refreshToken = require('../controllers/refreshtoken.controller');

router.route('/api/refreshToken').post(refreshToken.newToken);

module.exports = router;
