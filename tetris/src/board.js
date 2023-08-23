export default class Board {
    constructor (width = 10, height = 20) {
        this.width = width;
        this.height = height;
        this.board = [];
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
        const {x, y} = tetronimo;
        this.board[y][x] = tetronimo;
    }

    get tetronimos () {
      return this.board.flat().filter((cell) => cell !== false);
    }


    get absoluteTetronimos () {
      return this.tetronimos.map(tetronimo => tetronimo.absolute)
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
      if (y < this.height - 1) {
        this.board[tetronimo.y][tetronimo.x] = false;
        tetronimo.y += 1;
        this.board[tetronimo.y][tetronimo.x] = tetronimo;
        tetronimo.floating = tetronimo.y < this.height - 1;
      } 
    }

    collidesToBottom(tetronimo) {
      return tetronimo.collidingBottom.some(this.#overlaps());
    }

    collidesToRight(tetronimo) {
      return tetronimo.collidingRight.some(this.#overlaps());
    }

    collidesToLeft(tetronimo) {
      return tetronimo.collidingLeft.some(this.#overlaps());
    }

    #overlaps(part) {
      return part => this.absoluteTetronimos.flat().some(existing => existing.x === part.x && existing.y === part.y)
    }
}