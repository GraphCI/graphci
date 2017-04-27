// Add support for non-exact paths

const expect = require('chai').expect;

const findTargets = require('./find-targets');

describe('server findTargets', () => {
  context('when things get tricky', () => {
    const input = {
      a: { triggers: [] },
      b: { triggers: ['bolognese.md', 'alfredo.md'] },
      c: { triggers: ['bolognese.md'] },
      d: { triggers: ['alfredo.md'] },
      e: { triggers: ['carbonara.md', 'bolognese.md'] },
      f: { triggers: ['puttanesca.md'] },
    };
    const push = {
      commits: [
        {
          added: ['alfredo.md'],
          removed: ['carbonara.md', 'puttanesca.md'],
          modified: ['bolognese.md'],
        },
      ],
    };

    const result = findTargets({ input, push });

    it('returns input unchanged', () => {
      expect(result.input).to.eql(input);
    });

    it('find targets', () => {
      expect(result.targets).to.include('b', 'c', 'd', 'e', 'f');
      expect(result.targets.length).to.eq(5);
    });
  });
});
