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
    console.log("overlapCount:  sanitized: ", sanitzedOtherWord);
    let overlapCount = 0;
    for (let i = 1; i <= sanitzedOtherWord.length; i++) {
      console.log("overlapCount:  checking: ", this.sanitize(word), sanitzedOtherWord.substring(0, i), word.endsWith(sanitzedOtherWord.substring(0, i)), i);
      if (this.sanitize(word).endsWith(sanitzedOtherWord.substring(0, i))) {
        overlapCount = i;
      }
    }
    console.log("overlapCount: ", overlapCount);
    return overlapCount;
  }
}