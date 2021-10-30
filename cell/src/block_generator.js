import Block from "./block";
import blockTypes from "./block_types";

export default class BlockGenerator {
    constructor (scene, dificulty = 0) {
        this.scene = scene;
        this.block
    }

    generate () {
        return new Block(
            this.scene,
            this.scene.center_width,
            this.scene.center_height, 
            this.getRandomType()
        );
    }

    getRandomType () {
        return blockTypes[Phaser.Math.Between(0, blockTypes.length - 1)]
    }
}