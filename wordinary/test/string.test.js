import Word from '../src/word'
import Dictionary from '../src/dictionary'


describe('Word', () => {
  let dictionary;
  beforeAll(() => {
    dictionary = new Dictionary();
  })

  describe('isValid', () => {
    it('check wether it is valid or not', () => {
      const word = new Word(dictionary);
      expect(word.isValid("car")).toBe(true);
    });

    it('shoud return false with short words', () => {
      const word = new Word(dictionary);
      expect(word.isValid("c")).toBe(false);
    });
  })

  describe('overlap', () => {
    it('returns the overlap count', () => {
      const word = new Word(dictionary);
      expect(word.overlap("pasaje","ropa")).toBe(0);
    })

    it('should return 1 when single overlap', () => {
      const word = new Word(dictionary);
      expect(word.overlap("carro", "opera")).toBe(1);
    })

    it('returns the overlap count', () => {
      const word = new Word( dictionary);
      expect(word.overlap("lyar", "artificial")).toBe(2);
    })

    it.only('returns the right overlap count even with case or extra space', () => {
      const word = new Word( dictionary);
      expect(word.overlap("  Persona ","  SonAta  ")).toBe(4);
      expect(word.overlap("altered","red")).toBe(3);
    })
  })
})

