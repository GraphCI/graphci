const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const getRuns = require('./get-runs');

const app = express();

const getCode = (error) => {
  console.error(error);

  return error.code || 400;
};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));

app.get('/api/v1/runs', (req, res) => (
  getRuns()
    .then((data) => res.json(data))
    .catch((err) => res.sendStatus(getCode(err)))
));

module.exports = app;
