import words from "./words";

export default class Dictionary {
  constructor(language = "en") {
  }

  isDefined(word) {
    return words.includes(word);
  }

  randomWord() {
    return words[Math.floor(Math.random() * words.length)];
  }
}