const AWS = require('aws-sdk');
const fs = require('fs');
const denodeify = require('denodeify');

const readFile = denodeify(fs.readFile);

const Bucket = 'dockercise';
const getFilename = (runId, name, ext) => `${[runId, name].join('/')}.${ext}`;

let warnedAboutAccessDenied = false;
const warnAboutAccessDenied = (err) => {
  if (warnedAboutAccessDenied) {
    return;
  }

  console.warn('dockercise| A problem occurred trying to upload results:', err.message)
  warnedAboutAccessDenied = true;
}

const uploadRun = (runId, stages, edges) => {
  const bucket = new AWS.S3({ params: { Bucket } });

  const params = {
    Key: getFilename(runId, 'index', 'json'),
    Body: new Buffer(JSON.stringify({ stages, edges }), 'utf8'),
    ContentEncoding: 'utf8',
    ContentType: 'application/json',
    ACL: 'public-read',
  };

  return bucket.upload(params).promise().catch(warnAboutAccessDenied);
};

const uploadLogs = (runId, name, file) => {
  const bucket = new AWS.S3({ params: { Bucket } });

  const params = (Body) => ({
    Key: getFilename(runId, name, 'log'),
    Body,
    ContentEncoding: 'utf8',
    ContentType: 'application/json',
    ACL: 'public-read',
  });

  return readFile(file, 'utf8')
    .then((contents) => {
      if (!contents) {
        return undefined;
      }

      return bucket.upload(params(contents)).promise().catch(warnAboutAccessDenied);
    });
};


const uploadResults = (runId, name, results) => {
  const bucket = new AWS.S3({ params: { Bucket } });

  const params = {
    Key: getFilename(runId, name, 'json'),
    Body: new Buffer(JSON.stringify(results), 'utf8'),
    ContentEncoding: 'utf8',
    ContentType: 'application/json',
    ACL: 'public-read',
  };

  return bucket.upload(params).promise().catch(warnAboutAccessDenied);
};

module.exports = { uploadRun, uploadResults, uploadLogs };
