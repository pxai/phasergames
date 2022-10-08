import Tile from "./tile";

export default class Dungeon {
    constructor (scene, x, y, length = 3) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.length = length;
        
    }

    generate () {
        Array(this.length).fill(0).map((_, i) => {

        })
    }
}

class Row {
    constructor(scene, x, y, length = 3) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.length = length;
        this.generate();
    }

    generate () {
        Array(this.length).fill(0).map((_, i) => {
            return new Tile(this.scene, this.x + (i * 32), this.y);
        });
    }
}