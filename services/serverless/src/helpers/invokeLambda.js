const AWS = require('aws-sdk');

const invokeLambda = (lambdaName, payload) =>
  new AWS.Lambda({ region: process.env.REGION })
    .invoke({
      FunctionName: lambdaName,
      Payload: JSON.stringify(payload),
    })
    .promise()
    .then((response) => JSON.parse(response.Payload));

module.exports = invokeLambda;
