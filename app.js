require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App listening on http://localhost:${port}`);
});