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

    it('builds edges', () => {
      expect(build(stages, targets).edges).to.eql([
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

  context('different kinds of dependencies', () => {
    const stages = {
      a: {},
      b: { after: 'a' },
      c: { img: 'b' },
      d: { run: 'c' },
      e: { vol: 'd' },
      f: { env: 'e' },
      g: { done: 'f' },
    };
    const targets = ['g'];

    it('builds edges', () => {
      expect(build(stages, targets).edges).to.eql([
        ['f', 'g'],
        ['e', 'f'],
        ['d', 'e'],
        ['c', 'd'],
        ['b', 'c'],
        ['a', 'b'],
      ]);
    });
  });
});
