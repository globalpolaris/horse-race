const express = require('express');
const router = express.Router();

router.get('/horse', (req, res) => {
  res.send('Get Horse');
});

router.post('/horse', (req, res) => {
  res.send('Post Horse');
});

router.put('/horse', (req, res) => {
  res.send('Update Horse');
});

router.delete('/horse', (req, res) => {
  res.send('Delete Horse');
});

module.exports = router;
