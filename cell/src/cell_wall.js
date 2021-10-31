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
                return block;
            })
        )
        console.log(this.cell)
    }

    get center () {
        return this.cell[12][12];
    }
    evolve () {

    }

    update () {

    }
}

export default CellWall;