const AWS = require('aws-sdk');

module.exports = (TableName, Item) =>
  new AWS.DynamoDB.DocumentClient()
    .put({ TableName, Item })
    .promise();
