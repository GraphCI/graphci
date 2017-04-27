const AWS = require('aws-sdk');

const s3 = new AWS.S3();

const params = (runId) => ({
  Bucket: process.env.BUCKET,
  Key: `${runId}/summary.json`,
});

module.exports = (runId) => s3.getObject(params(runId)).promise()
  .then((data) => JSON.parse(data.Body.toString()));
