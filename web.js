#! /usr/bin/env node

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.argv[2] || 3000;

app.use(bodyParser.json());

app.post('/github/build', (req, res) => {
  const url = req.body.repository.clone_url;
  const commit = req.body.after;
  console.info('Repo: ', url);
  console.info('Commit: ', commit);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.info(`GraphCI is ALIVE (on port ${port}). No disassemble.`);
});
