const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const getRun = require('./get-run');
const getRuns = require('./get-runs');
const getNode = require('./get-node');

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

app.get('/api/v1/run/:runId', (req, res) => (
  getRun(req.params.runId)
    .then((data) => res.json(data))
    .catch((err) => res.sendStatus(getCode(err)))
));

app.get('/api/v1/run/:runId/:node', (req, res) => (
  getNode(req.params.runId, req.params.node)
    .then((data) => res.send(data))
    .catch((err) => res.sendStatus(getCode(err)))
));

module.exports = app;
