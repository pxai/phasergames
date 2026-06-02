import words from "./words";

export default class Dictionary {
  constructor(language = "en") {
    this.language = language;
    this.lengths = {
      "en": words["en"].length,
    };
  }

  isDefined(word) {
    return words[this.language].includes(word);
  }

  randomWord() {
    return words[this.language][Math.floor(Math.random() * this.lengths[this.language])];
  }
}