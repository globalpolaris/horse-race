const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/user', (req, res) => {
  res.send('Get User');
});
router.post('/user/register', userController.register);
router.post('/user/login', userController.login);
router.post('/user/logout', userController.logout);
router.put('/user', (req, res) => {
  res.send('Get User');
});
router.delete('/user', (req, res) => {
  res.send('Get User');
});

module.exports = router;
