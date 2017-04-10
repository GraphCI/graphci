const AWS = require('aws-sdk');

const s3 = new AWS.S3();

const params = {
  Bucket: 'dockercise',
  delimiter: '/',
  EncodingType: 'url',
};

module.exports = () => s3.listObjectsV2(params).promise();
