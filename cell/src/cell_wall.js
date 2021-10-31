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
       // this.evolve()
    }

    get center () {
        return this.cell[12][12];
    }

    evolve () {
        console.log(this.cell)
        this.setCell(6, 7, "red")
        this.setCell(8, 5, "yellow")
       /* for (let x = 0; x < this.cell.length; x++) {
            for (let y = 0;y < this.cell[x].length; y++) {
                if (this.cell[x][y].content === "") {
                    console.log("About to update!", x, y)
                    this.cell[x][y] = {content: "purple", x: this.cell[x][y].x, y: this.cell[x][y].y  }
                    new Block(
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
            for (let y = this.cell[x].length - 1;y >= 0; y--) {
                if (this.cell[x][y].content === "") {
                    console.log("About to update!", x, y)
                    this.cell[x][y] = {content: "purple", x: this.cell[x][y].x, y: this.cell[x][y].y  }
                    new Block(
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
        }*/
        //console.log(this.cell)
    }

    setCell(x, y, color) {
        this.cell[x][y] = { content: color, x: this.cell[x][y].x, y: this.cell[x][y].y};
        new Block(
            this.scene,
            this.cell[x][y].x + 50,
            this.cell[x][y].y + 12, 
            { "type": color, "color": 0xffffff },
            {x, y},
            false
        );
        console.log("Se cell: ", x, y, this.cell[x][y])
    }

    update () {

    }
}

export default CellWall;