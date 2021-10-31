import Block from "./block";
import blockTypes from "./block_types";

export default class BlockGenerator {
    constructor (scene, dificulty = 0) {
        this.scene = scene;
        this.block
    }

    generate (center) {
        return new Block(
            this.scene,
            center.x + 50,
            center.y + 12, 
            this.getRandomType(),
            {x: 12, y: 12}
        );
    }

    getRandomType () {
        return blockTypes[Phaser.Math.Between(0, blockTypes.length - 1)]
    }
}