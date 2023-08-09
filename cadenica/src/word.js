export default class Word {
  constructor(word, lang = 'en') {
    this.word = this.sanitize(word);
    this.lang = lang;
  }

  sanitize(word) {
    return word.trim().toLowerCase();
  }

  isValid() {
    return this.isLongEnough() && this.isInDictionary();
  }

  isInDictionary() {
    return true;
  }


  isLongEnough() {
    return this.word.length > 1;
  }


  overlap(otherWord) {
    const sanitzedOtherWord = this.sanitize(otherWord);
    let overlapCount = 0;
    for (let i = 1; i < sanitzedOtherWord.length; i++) {
      if (this.word.endsWith(sanitzedOtherWord.substring(0, i))) {
        overlapCount = i;
      }
    }
    return overlapCount;
  }
}