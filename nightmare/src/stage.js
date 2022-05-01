import { Empty } from "./tile";

export default class Stage {
    constructor (name) {
        this.name = name;
        this.init();
    }

    init() {
        this.width = Phaser.Math.Between(2, 6)
        this.height = Phaser.Math.Between(2, 5)
        this.tiles = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.tiles.push(new Empty(x, y))
            }
        }
    }
}