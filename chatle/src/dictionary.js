import words from "./words";

export default class Dictionary {
  constructor(language = "en") {
    this.language = language;
  }


  isDefined(word) {
    return words[this.language].includes(word);
  }

  randomWord() {
    return words[this.language][Math.floor(Math.random() * words[this.language].length)];
  }
}