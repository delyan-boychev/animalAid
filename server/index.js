const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const app = express();
const port = 4000;
mongoose.connect(process.env.CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true});
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.listen(port, () => {
  console.log(`Animal Aid server is running!`);
});