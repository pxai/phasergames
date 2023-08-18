import Alphabetic from '../src/alphabetic';

describe('Generator', () => {
  it('should generate the next sequence', () => {
    const generator = new Alphabetic();
    const sequence = "abcdefghijklmnopqrstuvwxyz";
    sequence.split('').forEach((letter, index) => {
      expect(generator.generateNext()).toEqual(letter);
    });
  });

  it('should generate the next sequence with bigger steps', () => {
    const generator = new Alphabetic();
    const sequence = "abcdefghijklmnopqrstuvwxyz";
    sequence.split('').forEach((letter, index) => {
      expect(generator.generateNext()).toEqual(letter);
    });


    sequence.split('').forEach((prefix, index) => {
      sequence.split('').forEach((letter, index) => {
        expect(generator.generateNext()).toEqual(prefix + letter);
      });
    });
  });
});