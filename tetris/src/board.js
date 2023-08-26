export default class Board {
    constructor (width = 10, height = 20) {
        this.width = width;
        this.height = height;
        this.board = [];
        this.activeTetronimo = null;
        this.#createBoard();
    }

    #createBoard () {
      for (let i = 0; i < this.height; i++) {
        this.board.push([]);
        for (let j= 0; j < this.width; j++)
          this.board[i].push(false);
      }
    }

    print() {
      let all = "";
      for (let i = 0; i < this.height; i++) {
        let row = "";
        for (let j = 0; j < this.width; j++) {
          row += this.board[i][j] ? "[X]" : "[ ]";
        }
        all += row + "\n";
      }

      return all;
    }

    add (tetronimo) {
      if (!this.touchdown) return;
        const {x, y} = tetronimo;
        this.board[y][x] = tetronimo;
        this.activeTetronimo = tetronimo;
    }

    get touchdown () {
      return this.tetronimos.every(tetronimo => !tetronimo.floating);
    }

    get tetronimos () {
      return this.board.flat().filter((cell) => cell !== false);
    }


    get absoluteTetronimos () {
      return this.tetronimos.map(tetronimo => tetronimo.absolute).flat()
    }

    get fixedTetronimos () {
      return this.tetronimos.filter(tetronimo => !tetronimo.floating).flat()
    }

    move () {
        this.tetronimos.forEach((tetronimo) => {
            if (tetronimo.floating) {
                this.#moveDown(tetronimo);
            }
        });
    }

    #moveDown (tetronimo) {
      const {x, y} = tetronimo;
      if (y < this.height - 1 && !this.collidesToBottom(tetronimo)) {
        this.board[tetronimo.y][tetronimo.x] = false;
        tetronimo.y += 1;
        this.board[tetronimo.y][tetronimo.x] = tetronimo;
        tetronimo.floating = tetronimo.y < this.height - 1;
      }  else {
        tetronimo.floating = false; 
      }
    }

    right (tetronimo) {
      const {x, y} = tetronimo;
      if (x < this.width - 1 && !this.collidesToRight(tetronimo)) {
        this.board[tetronimo.y][tetronimo.x] = false;
        tetronimo.right();
        this.board[y][x + 1] = tetronimo;
      }
    }

    left (tetronimo) {
      const {x, y} = tetronimo;  
      if (x > 0 && !this.collidesToLeft(tetronimo)) {
        this.board[tetronimo.y][tetronimo.x] = false;
        tetronimo.left();
        this.board[y][x - 1] = tetronimo;
      }
    }

    collidesToBottom(tetronimo) {
      return tetronimo.collidingBottom.some(this.#overlaps());
    }

    collidesToRight(tetronimo) {
      return tetronimo.x === this.width - 1 || tetronimo.collidingRight.some(this.#overlaps());
    }

    collidesToLeft(tetronimo) {
      return tetronimo.x === 0 || tetronimo.collidingLeft.some(this.#overlaps());
    }

    #overlaps(part) {
      return part => this.absoluteTetronimos.some(existing => existing.x === part.x && existing.y === part.y)
    }

    completed() {
      return this.#bottomUp.map(y =>{
        const touchingTetronimos = this.fixedTetronimos.filter(tetro => tetro.absolute.some(position => position.y === y));
        const touching = touchingTetronimos.map(tetronimo => tetronimo.absolute.filter(position => position.y === y))

        return touching.flat().length === this.width ? touching : []
      })
    }

    removeLines() {
      const lines = this.completed().flat().flat();
      if (lines < 0) return;
      lines.forEach(position => {
        const tetronimo = this.tetronimoIn({x: position.x, y: position.y});
        tetronimo && tetronimo.removePosition({x: position.x, y: position.y})
      })
      this.#moveFixed();
    }

    #moveFixed() {
      this.fixedTetronimos.forEach(tetronimo => {
        if (!this.collidesToBottom(tetronimo)) {
          this.#moveDown(tetronimo)
        }
      })
    }

    tetronimoIn({x, y}) {
      return this.tetronimos.find(tetronimo => tetronimo.absolute.some(position => position.x === x && position.y === y))
    }

    get #bottomUp () {
      return [...Array(this.height).keys()].sort((a,b) => b-a)
    }
}