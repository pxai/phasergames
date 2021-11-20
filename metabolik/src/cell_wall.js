import Cell from "./cell";
import Block from "./block";
import blockTypes from "./block_types";
import evolution from "./evolutions";

class CellWall {
    constructor (scene, difficulty = 0) {
        this.scene = scene;
        this.difficulty = difficulty;
        this.coords = [9, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 3, 9];
        this.generateWall();
    }

    generateWall () {
        this.cell = Cell.map( (row, x) => 
            row.map( (block, y) => {
                let b = null;
                if (block.content === "purple") {
                    b = new Block(
                        this.scene,
                        block.x + 50,
                        block.y + 12, 
                        { "type": "purple", "color": 0xffffff },
                        {x, y},
                        false
                    );
                    return {content: "purple", ...block, block: b};
                }
                return null;
            })
        )
    }

    get center () {
        return this.cell[12][12];
    }

    evolve () {
        this.coords.forEach( (y, i) => {
            let x = i + 1;
            if (!this.cell[x][y]) {
                this.setCell(x, y, this.getRandomColor())
            }

            if (!this.cell[x][this.cell.length - 1 - y]) {
                this.setCell(x, this.cell.length -1 - y, this.getRandomColor())
            }
        });

        this.coords.forEach( (c, i) => this.coords[i] = c + 1 );


        this.scene.playAudio("evolve");
        this.scene.updateHealth()
    }

    firstEvolution () {
        this.coords.forEach( (y, i) => {
            let x = i + 1;
            if (Phaser.Math.Between(0, 1) > 0) {
                if (!this.cell[x][y]) {
                    this.setCell(x, y, this.getRandomColor())
                }
            } else {
                if (!this.cell[x][this.cell.length - 1 - y]) {
                    this.setCell(x, this.cell.length -1 - y, this.getRandomColor())
                }
            }
        });
    }

    setCell(x, y, color) {
        if (x === 12 && y === 12) {
            this.scene.gameOver()
        } else {
            this.cell[x][y] = { 
                content: color, 
                x: x * 32, 
                y: x,
                block: new Block(
                    this.scene,
                    Cell[x][y].x + 50,
                    Cell[x][y].y + 12, 
                    { "type": color, "color": 0xffffff },
                    {x, y},
                    false
                )
            };
        }
    }

    update () {
    }

    getRandomColor () {
        return blockTypes[Phaser.Math.Between(0, blockTypes.length - 1)].type;
    }

    removeBlocks (x, y, color) {
        this.toRemove = [];
        this.toRemove = [`${x}:${y}:${color}`];
        this.searchAdjacents(x, y, color);

        return this.toRemove;
    }

    searchAdjacents (x, y, color) {
        if (x > 0 && this.cell[x - 1][y]?.content === color && !this.isIncluded(x - 1, y, color)) {
            this.toRemove.push(`${x - 1}:${y}:${color}`)
            this.searchAdjacents(x - 1, y, color);
        } 
        if (x < 24 && this.cell[x + 1][y]?.content === color && !this.isIncluded(x + 1, y, color)) {
            this.toRemove.push(`${x + 1}:${y}:${color}`)
            this.searchAdjacents(x + 1, y, color);
        } 
        if (y > 0 && this.cell[x][y - 1]?.content === color && !this.isIncluded(x, y - 1, color)) {
            this.toRemove.push(`${x}:${y - 1}:${color}`)
            this.searchAdjacents(x, y - 1, color);
        } 
        if (y < 24 && this.cell[x][y + 1]?.content === color && !this.isIncluded(x, y + 1, color)) {
            this.toRemove.push(`${x}:${y + 1}:${color}`)
            this.searchAdjacents(x, y + 1, color);
        }
        return;
    }

    moveDownHanging() {
        const removeSpaces = (a, b) => !a ? 1 : !b ? -1 : 0;
        this.coords.forEach( (y, i) => {
            let x = i + 1;
            
            let begin = this.cell[x].slice(0, y)
            let middle1 = this.cell[x].slice(y, 12).sort(removeSpaces)
            let middle2 = this.cell[x].slice(13, this.cell[x].length - y).reverse().sort(removeSpaces).reverse()
            let end = this.cell[x].slice(this.cell[x].length - y, this.cell[x].length)
            this.cell[x] = [...begin, ...middle1, this.cell[x][12], ...middle2, ...end]
            this.repaintRow(x);
            // console.log(`Row: ${i} ${[...begin, ...middle1, ...middle2, ...end]}`)
        });
    }

    repaintRow(x) {
        this.cell[x].forEach((element, i) => {
            if (element && element.content !== "purple") {
                element.block.x = (i * 32) + 50;
                element.block.y = (x * 32) + 12;
            }
        })
    }

    isIncluded(x, y, color) {
        return this.toRemove.includes(`${x}:${y}:${color}`)
    }

    get freePositions () {
        let _freePositions = 0;
        for (let x = 0; x < this.cell.length; x++) {
            for (let y = 0; y < this.cell[x].length; y++) {
                if (!this.cell[x][y])
                    _freePositions++;
            }
        }

        return _freePositions;
    }
}

export default CellWall;