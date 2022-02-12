export default class Block extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name = 0, fixed = false) {
        super(scene, x, y , `block${name}`);
        this.scene = scene;
        this.name = `block${name}`;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.immovable = true;
        this.body.moves = false;
        this.below = null;
        this.fixed = fixed;

        this.extend()
    }

    extend() {
        if (Phaser.Math.Between(0, 4) > 2) {
            console.log("HEre we go")
            this.below = new Block(this.scene, this.x, this.y + 64, Phaser.Math.Between(0, 1))
            this.scene.breakableBlocks.add(this.below);
        }
    }

    destroy() {
        this.drop();
        super.destroy();
    }

    drop () {
        console.log("Lets see")
        if (!this.below) return;
        console.log("Ok, not null")
        this.below.body.moves = true;
        this.below.body.immovable = false;

        console.log("Going down")
        this.below.drop();
    }
}
