import Block from "./block";
import blockTypes from "./block_types";

export default class BlockGenerator {
    constructor (scene, dificulty = 0) {
        this.scene = scene;
        this.createIncoming();
    }

    generate (center) {
        console.log("Before update: ", this.incoming)
        const nextBlock = this.updateIncoming();
        console.log("After update: ", this.incoming, nextBlock)
        return new Block(
            this.scene,
            center.x + 50,
            center.y + 12, 
            nextBlock,
            {x: 12, y: 12}
        );
    }

    createIncoming () {
        this.incoming = Array(5).fill("").map(i => this.getRandomType());
    }

    updateIncoming () {
        console.log(this.incoming);
        this.incoming.unshift(this.getRandomType())
        console.log("Now:",this.incoming)
        return this.incoming.pop();
    }

    getRandomType () {
        return blockTypes[Phaser.Math.Between(0, blockTypes.length - 1)]
    }
}