const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6574f6d67e52519e3d69a6ab',
  };
  next();
});

app.use(router);

async function connect() {
  try {
    mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
    await app.listen(PORT);
    console.log(`App listening on port ${PORT}`);
  } catch (err) {
    console.log(err);
  }
}

connect();
