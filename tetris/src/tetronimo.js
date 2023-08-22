
import shapes from "./shapes";

export default class Tetromino {
    constructor (x, y, shape, color = "red") {
        this.x = x;
        this.y = y;
        this.color = color;
        this.shape = shape;
        this.rotation = 0;
        this.#loadPositions();
        this.floating = true;
    }

    #loadPositions () {
        this.positions = shapes[this.shape];
    }

    rotateLeft () {
        this.rotation = this.rotation === 0 ? 3 : this.rotation - 1;
    }

    rotateRight () {
        this.rotation = this.rotation === 3 ? 0 : this.rotation + 1;
    }

    get current() {
        return this.positions[this.rotation];
    }
}
