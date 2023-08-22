export default class Board {
    constructor (width = 10, height = 10) {
        this.width = width;
        this.height = height;
        this.board = [];
        this.#createBoard();
    }

    #createBoard () {
      this.board = new Array(this.height).fill(false);
      for (let i = 0; i < this.width; i++) {
        this.board[i] = new Array(this.width).fill(false);
      }
    }

    print() {
      let all = "";
      for (let i = 0; i < this.board.length; i++) {
        let row = "";
        for (let j = 0; j < this.board.length; j++) {
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

    move () {
        this.tetronimos.forEach((tetronimo) => {
            if (tetronimo.floating) {
              console.log("Before", tetronimo);
                this.#moveDown(tetronimo);
                console.log("Moving tetronimo", tetronimo);
            }
        });
    }

    #moveDown (tetronimo) {
      tetronimo.y += 1;
    }
}