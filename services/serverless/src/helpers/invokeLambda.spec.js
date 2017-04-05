'use strict';

const chai = require('chai');
const sinonChai = require('sinon-chai');
const AWS = require('aws-sdk-mock');

chai.use(sinonChai);
const expect = chai.expect;

const invokeLambda = require('./invokeLambda');

describe('helpers getWorkOrder', () => {
  afterEach(() => {
    AWS.restore('Lambda');
  });

  it('gets a work order', (done) => {
    const lambdaName = 'CoolLambdaName';
    const payload = { workOrderNumber: 'WO1234' };
    const expectedResponsePayload = { someKey: 'someValue' };

    AWS.mock('Lambda', 'invoke', (params, callback) => {
      expect(params).to.eql({
        FunctionName: lambdaName,
        Payload: JSON.stringify(payload),
      });

      callback(null, { Payload: JSON.stringify(expectedResponsePayload) });
    });

    invokeLambda(lambdaName, payload).then((response) => {
      expect(response).to.eql(expectedResponsePayload);
      done();
    });
  });
});
