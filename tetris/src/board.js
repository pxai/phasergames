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
        for (let j = 0; j < this.width; j++) row += this.board[i][j] ? "[X]" : "[ ]";
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
}