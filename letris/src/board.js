export default class Board {
    constructor (width, height) {
        this.positions = Array(height).fill(null);
        for (let i = 0; i < height; i++) 
            this.positions[i] = Array(width).fill(null);
        
    }

    addToBoard(x, y, element) {
        this.positions[x][y] = element;
    }

    words(x, y) {
        const horizontal = this.getHorizontal(x, y);
        const vertical = this.getVertical(x, y);
        return [horizontal, vertical]
    }

    getHorizontal (x, y) {
        let word = "";
        //console.log(this.positions)
        for (let i = y;i >= 0; i--) {
            if (this.positions[x][i] !== null ) {
                //console.log("Check", i, y, this.positions[x][i])
                word = this.positions[x][i].letter + word;
            } else {
                //console.log("Break", i, y, this.positions[x][i])
                break;
            }
        }
 
        if (y < this.positions[x].length - 1) {
            for (let i = y + 1; i < this.positions[x].length; i++) {
                if (this.positions[x][i] !== null) {
                  //  console.log("Check", i, y, this.positions[x][i])
                    word += this.positions[x][i].letter;
                } else {
                   // console.log("Break", i, y, this.positions[x][i])
                    break;
                }
            }
        }

        //console.log("WORD2: ", word)

        return word;
    }

    getVertical (x, y) {
        let word = "";
        //console.log(this.positions)
        for (let i = x;i >= 0; i--) {
            if (this.positions[i][y] !== null ) {
                word = this.positions[i][y].letter + word;
            } else {
                break;
            }
        }
 
        if (x < this.positions.length - 1) {
            for (let i = x + 1; i < this.positions.length; i++) {
                if (this.positions[i][y] !== null) {
                    word += this.positions[i][y].letter;
                } else {
                    break;
                }
            }
        }

        return word;
    }

    substrings(str, size = 2) {
        let i, j, result = [];
        size = (size || 0);
        for (i = 0; i < str.length; i++) {
          for (j = str.length; j - i >= size; j--) {
            result.push(str.slice(i, j));
          }
        }
        return result;
      }
}
