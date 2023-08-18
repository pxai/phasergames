import Generator from '../src/generator.js';

describe('Generator', () => {
  it('should generate the next sequence', () => {
    const sequence = "abcdefghijklmnopqrstuvwxyz";
    const generator = new Generator(sequence);

    sequence.split('').forEach((letter, index) => {
      expect(generator.generateNext()).toEqual(letter);
    });
  });

  it('should generate the next sequence with bigger steps', () => {
    const sequence = "abcdefghijklmnopqrstuvwxyz";
    const generator = new Generator(sequence);

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