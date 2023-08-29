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
      this.latest = tetronimo;
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

    absoluteTetronimosButThis (notThis) {
      return this.tetronimos.filter(t => t.name !== notThis.name).map(tetronimo => tetronimo.absolute).flat()
    }

    get fixedTetronimos () {
      return this.tetronimos.filter(tetronimo => !tetronimo.floating).flat()
    }

    gameOver () {
     // console.log("Active: ", this.latest, this.collidesToBottom(this.latest), this.latest.absolute.some(position => position.y <= 0))
      return this.collidesToBottom(this.latest) && this.latest.absolute.some(position => position.y <= 0)
    }

    move () {
        this.tetronimos.forEach((tetronimo) => {
            if (tetronimo.floating) {
                this.#moveDown(tetronimo);
            }
        });
    }

    pushDown (tetronimo) {
      if (tetronimo.lowest >= this.height - 1 || this.collidesToBottom(tetronimo)) return;
      this.#moveDown(tetronimo);
      this.pushDown(tetronimo);
    }

    #moveDown (tetronimo) {
      const {x, y} = tetronimo;
      if (y < this.height - 1 && !this.collidesToBottom(tetronimo)) {
        this.board[tetronimo.y][tetronimo.x] = false;
        tetronimo.y += 1;
        if (tetronimo.y < this.height)
          this.board[tetronimo.y][tetronimo.x] = tetronimo;
        tetronimo.floating = tetronimo.lowest < this.height - 1;
      }  else {
        tetronimo.floating = false; 
      }
    }

    rotate (tetronimo) {
      if (this.canRotate(tetronimo)) tetronimo.rotateRight()
    }

    right (tetronimo) {
      const {x, y} = tetronimo;
      if (tetronimo.rightest < this.width - 1 && !this.collidesToRight(tetronimo)) {
        this.board[tetronimo.y][tetronimo.x] = false;
        tetronimo.right();
        this.board[y][x + 1] = tetronimo;
      }
    }

    left (tetronimo) {
      const {x, y} = tetronimo;
      if (tetronimo.leftest > 0 && !this.collidesToLeft(tetronimo)) {
        this.board[tetronimo.y][tetronimo.x] = false;
        tetronimo.left();
        this.board[y][x - 1] = tetronimo;
      }
    }

    canRotate(tetronimo) {
      console.log("CAN ROTATE: ", tetronimo.nextRotation.map(position => position.x), !tetronimo.nextRotation.map(position => position.x).some(x => x < 0 || x >= this.width), !tetronimo.nextRotation.map(position => position.y).some(y => y >= this.height), !tetronimo.nextRotation.some(this.#overlaps()))
      return !tetronimo.nextRotation.map(position => position.x).some(x => x < 0 || x >= this.width) && 
      !tetronimo.nextRotation.map(position => position.y).some(y => y >= this.height) && !tetronimo.nextRotation.some(this.#overlapsOthers(tetronimo))
    }

    collidesToBottom(tetronimo) {
      return tetronimo.collidingBottom.some(this.#overlaps()) || tetronimo.collidingBottom.map(position => position.y).every(y => y >= this.height);
    }

    collidesToRight(tetronimo) {
      return tetronimo.x === this.width - 1 || tetronimo.collidingRight.some(this.#overlaps());
    }

    collidesToLeft(tetronimo) {
      return tetronimo.x === 0 || tetronimo.collidingLeft.some(this.#overlaps());
    }

    #overlapsOthers(tetronimo) {
      console.log("HERE: ", this.absoluteTetronimosButThis(tetronimo), tetronimo)
      return part => this.absoluteTetronimosButThis(tetronimo).some(existing => existing.x === part.x && existing.y === part.y)
    }

    #overlaps(part) {
      return part => this.absoluteTetronimos.some(existing => existing.x === part.x && existing.y === part.y)
    }

    completed() {
      return this.#bottomUp.map(y =>{
        const touchingTetronimos = this.fixedTetronimos.filter(tetro => tetro.absolute.some(position => position.y === y));
        const touching = touchingTetronimos.map(tetronimo => tetronimo.absolute.filter(position => position.y === y)).flat()

        return touching.flat().length === this.width ? touching : []
      })
    }

    removeLines() {
      const lines = this.completed();
      let levelsRemoved = 0;
      if (lines < 0) return;
      lines.forEach(line => {
        if (line.length === 0) return;
        levelsRemoved++
        //console.log("Before", this.tetronimos.map(t => t.absolute))
        line.forEach(position => {
          const tetronimo = this.tetronimoIn({x: position.x, y: position.y});
          //console.log("About to remove:", {x: position.x, y: position.y}, tetronimo?.name)
          tetronimo && tetronimo.removePosition({x: position.x, y: position.y})
        })
        //console.log("After", this.tetronimos.map(t => t.absolute), lines)

      })
      this.#moveFixed(levelsRemoved);
    }

    #moveFixed(levelsRemoved) {     
     // console.log("About to move: ", this.fixedTetronimos, levelsRemoved)
      this.fixedTetronimos.forEach(tetronimo => {
        //console.log("Lets move this: ", tetronimo, " Free to go?", !this.collidesToBottom(tetronimo))
        if (tetronimo.absolute.length > 0 && tetronimo.lowest < 19) tetronimo.fall(levelsRemoved);
      })
    }

    tetronimoIn({x, y}) {
      //if (x === 1 && y === 19) console.log("This is the case: ", x,y, this.tetronimos.map(t => t.absolute))
      return this.tetronimos.find(tetronimo => tetronimo.absolute.some(position => position.x === x && position.y === y))
    }

    get #bottomUp () {
      return [...Array(this.height).keys()].sort((a,b) => b-a)
    }
}