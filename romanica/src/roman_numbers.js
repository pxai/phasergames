export default class RomanNumbers {
    constructor (sequence = "")  {
      this.currentValue = 0;
      this.romanNumerals = {
        M: 1000,
        CM: 900,
        D: 500,
        CD: 400,
        C: 100,
        XC: 90,
        L: 50,
        XL: 40,
        X: 10,
        IX: 9,
        V: 5,
        IV: 4,
        I: 1,
      };
      this.current = "";
    }

    generateNext() {
      this.current = this._convertToRoman(++this.currentValue);
      return this.current;
    }

    _convertToRoman(num) {
      let result = '';

      for (const key in this.romanNumerals ) {
        while (num >= this.romanNumerals[key]) {
          result += key;
          num -= this.romanNumerals[key];
        }
      }

      return result;
    }

    reset() {
      this.currentValue = 0;
      this.current = "";
    }
}
