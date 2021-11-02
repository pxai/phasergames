import Cell from "./cell";
import Block from "./block";
import blockTypes from "./block_types";

class CellWall {
    constructor (scene, difficulty = 0) {
        this.scene = scene;
        this.difficulty = difficulty;
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
                }

                return {content: "purple", ...block, block: b};
            })
        )
    }

    get center () {
        return this.cell[12][12];
    }

    evolve () {
        for (let x = 0; x < this.cell.length; x++) {
            if (Phaser.Math.Between(0, 1) > 0) {
                for (let y = 0;y < this.cell[x].length; y++) {
                    if (this.cell[x][y].content === "") {
                        this.setCell(x, y, this.getRandomColor())
                        break;
                    }
                }
            } else {
                for (let y = this.cell[x].length - 1;y >= 0; y--) {
                    if (this.cell[x][y].content === "") {
                        this.setCell(x, y, this.getRandomColor())
                        break;
                    }
                }
            }
        }

        this.scene.playAudio("evolve");
        this.scene.updateHealth()
    }

    setCell(x, y, color) {
        if (x === 12 && y === 12) {
            this.scene.gameOver()
        } else {
            this.cell[x][y] = { 
                content: color, 
                x: this.cell[x][y].x, 
                y: this.cell[x][y].y,
                block: new Block(
                    this.scene,
                    this.cell[x][y].x + 50,
                    this.cell[x][y].y + 12, 
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
        console.log("Blocks to remove: ", this.toRemove)
        return this.toRemove;
    }

    searchAdjacents (x, y, color) {
        if (x > 0 && this.cell[x - 1][y].content === color && !this.isIncluded(x - 1, y, color)) {
            this.toRemove.push(`${x - 1}:${y}:${color}`)
            this.searchAdjacents(x - 1, y, color);
        } 
        if (x < 24 && this.cell[x + 1][y].content === color && !this.isIncluded(x + 1, y, color)) {
            this.toRemove.push(`${x + 1}:${y}:${color}`)
            this.searchAdjacents(x + 1, y, color);
        } 
        if (y > 0 && this.cell[x][y - 1].content === color && !this.isIncluded(x, y - 1, color)) {
            this.toRemove.push(`${x}:${y - 1}:${color}`)
            this.searchAdjacents(x, y - 1, color);
        } 
        if (y < 24 && this.cell[x][y + 1].content === color && !this.isIncluded(x, y + 1, color)) {
            this.toRemove.push(`${x}:${y + 1}:${color}`)
            this.searchAdjacents(x, y + 1, color);
        }
        return;
    }

    isIncluded(x, y, color) {
        return this.toRemove.includes(`${x}:${y}:${color}`)
    }

    get freePositions () {
        let _freePositions = 0;
        for (let x = 0; x < this.cell.length; x++) {
            for (let y = 0; y < this.cell[x].length; y++) {
                if (this.cell[x][y].content === "")
                    _freePositions++;
            }
        }

        return _freePositions;
    }
}

export default CellWall;