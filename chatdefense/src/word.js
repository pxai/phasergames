export default class Word {
  constructor(dictionary) {
    this.dictionary = dictionary;
  }

  sanitize(word) {
    return word.trim().toLowerCase();
  }

  isValid(word) {
    return this.isLongEnough(this.sanitize(word)) && this.isInDictionary(this.sanitize(word));
  }

  isInDictionary(word) {
    return this.dictionary.isDefined(word);
  }

  isLongEnough(word) {
    return word.length > 1;
  }

  overlap(word, otherWord) {
    const sanitzedOtherWord = this.sanitize(otherWord);
    let overlapCount = 0;
    for (let i = 1; i <= sanitzedOtherWord.length; i++) {
      if (this.sanitize(word).endsWith(sanitzedOtherWord.substring(0, i))) {
        overlapCount = i;
      }
    }
    return overlapCount;
  }
}