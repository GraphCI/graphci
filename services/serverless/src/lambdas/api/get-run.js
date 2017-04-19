const AWS = require('aws-sdk');

const s3 = new AWS.S3();

const params = {
  Bucket: 'dockercise',
  Key: '1489797888034/index.json',
};

module.exports = () => s3.getObject(params).promise()
  .then((data) => JSON.parse(data.Body.toString()));
