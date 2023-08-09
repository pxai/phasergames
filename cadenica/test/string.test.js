import Word from '../src/word'


describe('Word', () => {
  describe('isValid', () => {
    it('check wether it is valid or not', () => {
      const word = new Word("carro");
      expect(word.isValid()).toBe(true);
    });

    it('shoud return false with short words', () => {
      const word = new Word("c");
      expect(word.isValid()).toBe(false);
    });
  })

  describe('overlap', () => {
    it('returns the overlap count', () => {
      const word = new Word("pasaje");
      expect(word.overlap("ropa")).toBe(0);
    })

    it('should return 1 when single overlap', () => {
      const word = new Word("carro");
      expect(word.overlap("opera")).toBe(1);
    })

    it('returns the overlap count', () => {
      const word = new Word("carro");
      expect(word.overlap("ropa")).toBe(2);
    })

    it('returns the right overlap count even with case or extra space', () => {
      const word = new Word("  Persona ");
      expect(word.overlap("  SonAta  ")).toBe(4);
    })
  })
})

