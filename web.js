#! /usr/bin/env node

const express = require('express');
const bodyParser = require('body-parser');
const shell = require('shelljs');

const app = express();
const port = process.argv[2] || 3000;
const triggeringRepositoryDir = 'triggering-repo';

app.use(bodyParser.json());

app.post('/github/push', (req, res) => {
  const target = 'push';
  const url = req.body.repository.clone_url;
  const commit = req.body.after;

  shell.exec(`rm -rf ${triggeringRepositoryDir}`);
  shell.exec(`git clone ${url} ${triggeringRepositoryDir}`);
  shell.exec(`cd ${triggeringRepositoryDir}`);
  shell.exec(`git checkout ${commit}`);
  shell.exec(`dockercise ${target}`);
  shell.exec('cd ..');

  res.sendStatus(200);
});

app.listen(port, () => {
  console.info(`GraphCI is ALIVE (on port ${port}). No disassemble.`);
});
