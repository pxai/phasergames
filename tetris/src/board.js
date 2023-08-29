export default class Board {
    constructor (width = 10, height = 20) {
        this.width = width;
        this.height = height;
        this.tetronimos = [];
        this.activeTetronimo = null;
    }

    add (tetronimo) {
      this.latest = tetronimo;
      if (!this.touchdown) return;
        const {x, y} = tetronimo;
        this.tetronimos.push(tetronimo);
        this.activeTetronimo = tetronimo;
    }

    get touchdown () {
      return this.tetronimos.every(tetronimo => !tetronimo.floating);
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

        tetronimo.y += 1;
        if (tetronimo.y < this.height)

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
        tetronimo.right();
      }
    }

    left (tetronimo) {
      const {x, y} = tetronimo;
      if (tetronimo.leftest > 0 && !this.collidesToLeft(tetronimo)) {
        tetronimo.left();
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
      let highest = -1;
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
        highest = line[0].y;
      })

      if (levelsRemoved > 0) this.#moveFixed(levelsRemoved, highest);
    }

    #moveFixed(levelsRemoved, highest) {    
      console.log("REMOVED LINESSSSS") 
      console.log("About to move: ", this.fixedTetronimos, levelsRemoved, highest)
      for (let i=0;i<this.fixedTetronimos.length;i++) {
        console.log("before: ", this.fixedTetronimos.map(tetro => tetro.absolute))
        this.fixedTetronimos[i].movePositionAtHeight(highest - 1)
        console.log("After: ", this.fixedTetronimos.map(tetro => tetro.absolute))
      }
      // this.fixedTetronimos.forEach(tetronimo => {
      //   tetronimo.movePositionAtHeight(highest - 1)
      // })
    }

    tetronimoIn({x, y}) {
      //if (x === 1 && y === 19) console.log("This is the case: ", x,y, this.tetronimos.map(t => t.absolute))
      return this.tetronimos.find(tetronimo => tetronimo.absolute.some(position => position.x === x && position.y === y))
    }

    get #bottomUp () {
      return [...Array(this.height).keys()].sort((a,b) => b-a)
    }
}