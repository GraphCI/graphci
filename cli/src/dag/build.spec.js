const expect = require('chai').expect;

const build = require('./build');

describe('dag build', () => {
  context('multiple targets with varied dependency counts', () => {
    const stages = {
      a: {},
      b: { after: 'a' },
      c: {},
      d: { after: ['b', 'c'] },
      e: {},
      f: { after: 'e' },
      g: {},
      h: { after: ['f', 'g'] },
      i: {},
    };
    const targets = ['d', 'h', 'i'];

    it('builds dag', () => {
      expect(build(stages, targets)).to.eql([
        ['b', 'd'],
        ['c', 'd'],
        ['f', 'h'],
        ['g', 'h'],
        ['i', 'target'],
        ['a', 'b'],
        ['e', 'f'],
      ]);
    });
  });
});
