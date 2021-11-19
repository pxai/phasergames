import Block from "./block";
import blockTypes from "./block_types";

export default class BlockGenerator {
    constructor (scene, dificulty = 0) {
        this.scene = scene;
        this.createIncoming();
    }

    generate (center) {
        const nextBlock = this.updateIncoming();
        return new Block(
            this.scene,
            (12 * 32) + 50,
            (12 * 32) + 12, 
            nextBlock,
            {x: 12, y: 12}
        );
    }

    createIncoming () {
        this.incoming = Array(5).fill("").map(i => this.getRandomType());
    }

    updateIncoming () {
        this.incoming.unshift(this.getRandomType())
        return this.incoming.pop();
    }

    getRandomType () {
        return blockTypes[Phaser.Math.Between(0, blockTypes.length - 1)]
    }
}