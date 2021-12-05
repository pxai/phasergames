import Hex from "./hex";

export default class Background {
    constructor (scene, gridSize = 40, dificulty = 0) {
        this.scene = scene;
        this.gridSize = gridSize;
        this.background = []
        this.generate(gridSize);
        this.rightGrow = 0;
        this.downGrow = 0;
    }

    generate (gridSize) {
        Array(gridSize).fill(0).forEach( (row, i) => {
            this.background[i] = [];
            Array(gridSize).fill(0).forEach( (e, j) => {
                let offset = j % 2 === 0 ?  32 : 0; 
                this.background[i].push(new Hex(this.scene, (i * 64) + offset, j * 55))
            });
        });
    }

    right () {
        this.background.push([])
        Array(this.gridSize).fill(0).forEach( (row, j) => {
            const offset = j % 2 === 0 ?  32 : 0; 
            this.background[this.gridSize].push(new Hex(this.scene, ((this.gridSize + this.rightGrow) * 64) + offset, j * 55))
        });
        this.rightGrow++;
        this.background.shift().forEach(hex => hex.destroy());
    }

    left () {
        this.background.unshift([])
        this.rightGrow--;
        Array(this.gridSize).fill(0).forEach( (row, j) => {
            const offset = j % 2 === 0 ?  32 : 0; 
            this.background[0].push(new Hex(this.scene, (this.rightGrow * 64) + offset, j * 55))
        });
        this.background.pop().forEach(hex => hex.destroy());
    }

    up () {
        this.downGrow--;
        Array(this.gridSize).fill(0).forEach( (row, j) => {
            const offset = this.downGrow % 2 === 0 ?  32 : 0; 
            this.background[j].pop().destroy();
            this.background[j].unshift(new Hex(this.scene, (j * 64) + offset, this.downGrow * 55))
        });
    }

    down () {
        Array(this.gridSize).fill(0).forEach( (row, j) => {
            const offset = this.downGrow % 2 === 0 ?  32 : 0; 
            this.background[j].shift().destroy();
            this.background[j].push(new Hex(this.scene, (j * 64) + offset, (this.gridSize + this.downGrow) * 55))
        });
        this.downGrow++;
    }
}