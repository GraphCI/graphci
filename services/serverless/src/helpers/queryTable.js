const AWS = require('aws-sdk');

module.exports = (query) =>
  new AWS.DynamoDB.DocumentClient().query(query)
    .promise()
    .then((document) => document.Items[0]);
