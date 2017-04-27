const AWS = require('aws-sdk');

const s3 = new AWS.S3();

const log = (runId, node) => ({
  Bucket: process.env.BUCKET,
  Key: `${runId}/${node}.log`,
});

const results = (runId, node) => ({
  Bucket: process.env.BUCKET,
  Key: `${runId}/${node}.json`,
});

module.exports = (runId, node) => s3.getObject(results(runId, node)).promise()
  .then((resultsData) => {
    const resultsJson = JSON.parse(resultsData.Body.toString());

    return s3.getObject(log(runId, node)).promise()
      .then((logData) => {
        const logs = logData.Body.toString();

        return Object.assign({}, resultsJson, { logs });
      })
      .catch(() => Object.assign({}, resultsJson, { logs: 'No log data available' }));
  });
