const expect = require('chai').expect;
const AWS = require('aws-sdk-mock');
const insertInTable = require('./insertInTable');

describe('helpers insertInTable', () => {
  beforeEach(() => {
    AWS.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
      callback(null, params);
    });
  });

  afterEach(() => AWS.restore('DynamoDB.DocumentClient'));

  it('inserts in table', () => {
    const TableName = 'TableName';
    const Item = 'Item';

    return insertInTable(TableName, Item).then((params) => {
      expect(params).to.eql({ TableName, Item });
    });
  });
});
