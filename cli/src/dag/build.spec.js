const expect = require('chai').expect;

const build = require('./build');

describe('dag build', () => {
  context('multiple targets with varied dependency counts', () => {
    const input = {
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
    const { stages, edges } = build(input, targets);

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

    it('builds stages', () => {
      expect(stages).to.eql([
        { name: 'a' },
        { name: 'b' },
        { name: 'c' },
        { name: 'd' },
        { name: 'e' },
        { name: 'f' },
        { name: 'g' },
        { name: 'h' },
        { name: 'i' },
      ]);
    });
  });

  context('different kinds of dependencies', () => {
    const input = {
      a: {},
      b: { after: 'a' },
      c: { img: 'b' },
      d: { run: 'c' },
      e: { vol: 'd' },
      f: { env: 'e' },
      g: { done: 'f' },
    };
    const targets = ['g'];
    const { stages, edges } = build(input, targets);

    it('builds edges', () => {
      expect(edges).to.eql([
        ['f', 'g'],
        ['e', 'f'],
        ['d', 'e'],
        ['c', 'd'],
        ['b', 'c'],
        ['a', 'b'],
      ]);
    });

    it('builds stages', () => {
      expect(stages).to.eql([
        { name: 'a' },
        { name: 'b' },
        { name: 'c' },
        { name: 'd' },
        { name: 'e' },
        { name: 'f' },
        { name: 'g' },
      ]);
    });
  });
});
