#! /usr/bin/env node

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.argv[2] || 80;

app.use(bodyParser.json());

app.post('/github/build', (req, res) => {
  const urlToCheckout = req.body.commits[0].url;
  console.info(urlToCheckout);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.info(`GraphCI is ALIVE (on port ${port}). No disassemble.`);
});
