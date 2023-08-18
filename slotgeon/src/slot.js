export default class SlotMachine {
  constructor(symbols) {
    this.columns = [[], [], []];
    this.currentPositions = [0, 0, 0];
    this.isSpinning = false;
    this.generateSymbolColumns(symbols);
    this.counter = 3;
  }

  generateSymbolColumns (symbols) {
    this.symbols = [];
    this.symbols.push(symbols.slice().sort(() => Math.random() - 0.5));
    this.symbols.push(symbols.slice().sort(() => Math.random() - 0.5));
    this.symbols.push(symbols.slice().sort(() => Math.random() - 0.5));
  }

  spinColumns() {
    this.isSpinning = true;
    this.counter -= 2;
      for (let i = 0; i < this.columns.length; i++) {
        this.columns[i] = [
          this.symbols[0][this.counter + 1],
          this.symbols[1][this.counter],
          this.symbols[2][this.counter - 1]
        ];
        this.counter = (this.counter + 2 === this.symbols[0].length) ? 3 : this.counter + 1;
      }
      this.isSpinning = false;
  }

  spin() {
    if (!this.isSpinning) {
      this.spinColumns();
    }
  }

  checkWin() {
    const firstSymbol = this.columns[0][1];
    return this.columns.every(column => column[1] === firstSymbol);
  }
}