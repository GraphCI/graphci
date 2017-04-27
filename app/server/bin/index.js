#! /usr/bin/env node

const express = require('express');
const bodyParser = require('body-parser');
const shell = require('shelljs');
const runGraph = require('../../common/run-graph');

const app = express();
const port = 3000;
const path = 'triggering-repo';

const cleanUp = () => {
  shell.exec('cd ..');
  shell.exec(`rm -rf ${path}`);
};

app.use(bodyParser.json());

app.post('/github/push', (req, res) => {
  const url = req.body.repository.clone_url;
  const commit = req.body.after;

  shell.exec(`rm -rf ${path}`);
  shell.exec(`git clone ${url} ${path}`);
  shell.exec(`cd ${path}`);
  shell.exec(`git checkout ${commit}`);

  runGraph('path', req.body)
    .then(() => {
      cleanUp(path);
      res.sendStatus(200);
    })
    .catch((error) => {
      cleanUp(path);
      console.error(error);
      res.sendStatus(500);
    });
});

app.listen(port, () => {
  console.info(`GraphCI is ALIVE (on port ${port}). No disassemble.`);
});
