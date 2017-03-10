const Docker = require('dockerode');

const fs = require('fs');
const isWin = require('os').type() === 'Windows_NT';

const startDocker = () => {
  const socket = process.env.DOCKER_SOCKET || isWin ? '//./pipe/docker_engine' : '/var/run/docker.sock';
  const isSocket = fs.existsSync(socket) ? fs.statSync(socket).isSocket() : false;

  return (!isSocket) ? new Docker() : new Docker({ 'socketPath': socket });
}

module.exports = startDocker;
