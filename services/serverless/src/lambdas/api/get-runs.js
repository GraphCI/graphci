const AWS = require('aws-sdk');

const s3 = new AWS.S3();

const params = {
  Bucket: 'dockercise',
  Delimiter: '/',
  EncodingType: 'url',
  MaxKeys: 1000,
};

const pluckRuns = (prefix) => prefix.Prefix;

module.exports = () => s3.listObjectsV2(params).promise()
  .then((results) => results.CommonPrefixes.map(pluckRuns));
