const awsServerlessExpress = require('aws-serverless-express');
const api = require('./api');

const server = awsServerlessExpress.createServer(api);

exports.handler = (event, context) =>
  awsServerlessExpress.proxy(server, event, context);
