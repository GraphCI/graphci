const AWS = require('aws-sdk');

const s3 = new AWS.S3();

const params = {
  Bucket: 'dockercise',
  Delimiter: '/',
  EncodingType: 'url',
  MaxKeys: 1000,
};

module.exports = () => s3.listObjectsV2(params).promise();
