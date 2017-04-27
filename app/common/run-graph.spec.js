const expect = require('chai').expect;

const runGraph = require('./run-graph');

const push = {
  commits: [
    {
      added: [],
      removed: [],
      modified: ['bolognese.md'],
    },
  ],
};

describe('server runGraph', () => {
  context('optimistically', () => {
    it('builds input and dag', () =>
      runGraph('../test-data/test-repository', push).then(({ input, edges }) => {
        expect(input).to.eql({
          a: { img: 'example' },
          b: { img: 'example', after: ['a'] },
          c: { img: 'example', after: ['b'], triggers: ['bolognese.md'] },
          d: { img: 'example', triggers: ['carbonara.md', 'bolognese.md'] },
          e: { img: 'example' },
          meta: {},
        });
        expect(edges).to.eql([
          ['b', 'c'],
          ['d', 'target'],
          ['a', 'b'],
        ]);
      })
    );
  });
});
