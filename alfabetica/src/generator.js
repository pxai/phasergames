export default class Generator {
  constructor(sequence) {
    this.currentValue = 0;
    this.sequence = sequence;
    this.current = "";
  }

  generateNext() {
    this.current = this._convertToAlphabetic(++this.currentValue);
    return this.current;
  }

  _convertToAlphabetic(num) {
    let result = '';
    const base = this.sequence.length; // Number of letters in the alphabet

    while (num > 0) {
      const remainder = (num - 1) % base;
      result =  this.sequence[remainder] + result; // 97 is the ASCII code for 'a'
      num = Math.floor((num - 1) / base);
    }

    return result;
  }

  reset() {
    this.currentValue = 0;
    this.current = "";
  }
}
