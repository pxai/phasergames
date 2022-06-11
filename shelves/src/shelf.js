export default class Shelf extends Phaser.GameObjects.Container {
    constructor (scene, x, y, tile, index = 0, listeners = true) {
        super(scene, x, y) //"cards", index);

        this.scene = scene;

        this.tile = tile;
        this.index = index;

        this.scene.add.existing(this);
        this.addBlocks()

    }

    addBlocks() {
        Array(5).fill(0).forEach((i,_) => {
            let block = new Block(this, i * 32, 0) // Apparently mecessary if you want to animate
            this.add(block)
        })
    }
}

class Block extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name = "green") {
        super(scene, x, y , `block_${name}`);
        this.scene = scene;
        this.name = `block_${name}`;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false)
    }
}
