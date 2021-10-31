import Cell from "./cell";
import Block from "./block";

class CellWall {
    constructor (scene, difficulty = 0) {
        this.scene = scene;
        this.difficulty = difficulty;
        this.generatePositions();
        this.generateWall();
    }

    generatePositions () {

    }

    generateWall () {
        this.cell = Cell.map( (row, x) => 
            row.map( (block, y) => {
                if (block.content === "purple")
                new Block(
                    this.scene,
                    block.x + 50,
                    block.y + 12, 
                    { "type": "purple", "color": 0xffffff },
                    {x, y},
                    false
                );
                return {content: "purple", ...block};
            })
        )
        console.log(this.cell)
    }

    get center () {
        return this.cell[12][12];
    }

    evolve () {
        this.cell.forEach( (row, x) => {
            for (let y = 0;y < row.length; y++) {
                if (this.cell[x][y].content === "") {
                    this.cell[x][y] = new Block(
                        this.scene,
                        this.cell[x][y].x + 50,
                        this.cell[x][y].y + 12, 
                        { "type": "purple", "color": 0xffffff },
                        {x, y},
                        false
                    );
                    break;
                }
            }
            for (let y = row.length - 1;y >= 0; y--) {
                if (this.cell[x][y].content === "") {
                    this.cell[x][y] = new Block(
                        this.scene,
                        this.cell[x][y].x + 50,
                        this.cell[x][y].y + 12, 
                        { "type": "purple", "color": 0xffffff },
                        {x, y},
                        false
                    );
                    break;
                }
            }

        })
    }

    update () {

    }
}

export default CellWall;