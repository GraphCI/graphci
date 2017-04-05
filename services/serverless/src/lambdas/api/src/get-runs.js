const AWS = require('aws-sdk');

const s3 = new AWS.S3();

const params = {
  Bucket: 'dockercise',
  EncodingType: 'url',
  FetchOwner: false,
  MaxKeys: 0,
};

module.exports = () => s3.listObjectsV2(params).promise();
