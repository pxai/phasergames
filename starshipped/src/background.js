import Hex from "./hex";

export default class Background {
    constructor (scene, dificulty = 0) {
        this.scene = scene;
        this.generate();
    }

    generate () {
        Array(20).fill(0).forEach( (row, i) => {
            Array(20).fill(0).forEach( (e, j) => {
                let offset = j % 2 === 0 ?  32 : 0; 
                new Hex(this.scene, (i * 64) + offset, j * 55)
            });
        });
    }
}