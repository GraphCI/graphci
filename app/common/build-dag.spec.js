// Add test for case where dependent is also a target

const expect = require('chai').expect;

const build = require('./build-dag');

describe('buildDag', () => {
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
    const { edges } = build({ stages, targets });

    it('builds edges', () => {
      expect(edges).to.eql([
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
      c: { vol: 'b' },
      d: { env: 'c' },
    };
    const targets = ['d'];
    const { edges } = build({ stages, targets });

    it('builds edges', () => {
      expect(edges).to.eql([
        ['c', 'd'],
        ['b', 'c'],
        ['a', 'b'],
      ]);
    });
  });
});
