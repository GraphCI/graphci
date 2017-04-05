const expect = require('chai').expect;
const AWS = require('aws-sdk-mock');
const queryTable = require('./queryTable');

describe('helpers queryTable', () => {
  beforeEach(() => {
    AWS.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
      callback(null, { Items: [params] });
    });
  });

  afterEach(() => AWS.restore('DynamoDB.DocumentClient'));

  it('should query', () => {
    const query = {
      TableName: 'WorkOrders',
      KeyConditionExpression: 'workOrderNumber = :workOrderNumber',
      ExpressionAttributeValues: { ':workOrderNumber': '1234' },
    };

    return queryTable(query).then((queryPassedToAws) => {
      expect(queryPassedToAws).to.eql(query);
    });
  });
});
