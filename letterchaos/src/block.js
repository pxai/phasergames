export default class Block extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name = 0, fixed = false, grow = 0, free = true) {
        super(scene, x, y , `block${name}`);
        this.free = free;
        this.scene = scene;
        this.grow = grow;
        this.name = `block${name}`;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.immovable = true;
        this.body.moves = false;
        this.below = null;
        this.fixed = fixed;
        this.visible = false;

        if (!this.free && this.grow !== 0)
            this.extend()
    }

    reuse(x, y, fixed, grow, free) {
        this.x = x;
        this.y = y;
        this.fixed = fixed;
        this.grow = grow;
        this.free = free;
        this.body.enable = true;
        this.visible = true;

        return this;
    }

    extend() {
       // this.scene.time.delayedCall( 1000, () => { this.maybeChange() }, null, this);
    }

    maybeChange () {
        if ((!this.below || !this.below.active)&& !this.fixed && Phaser.Math.Between(0, 4) > 2) {
            this.destroy()
            return;
        }

        if ((!this.below || !this.below.active) && Phaser.Math.Between(0, 4) > 2) {
            //console.log("Grow!", this.scene, this.x, this.y + 32)
            this.below = new Block(this.scene, this.x, this.y + (32 * this.grow), Phaser.Math.Between(0, 1), false, this.grow)
            this.scene.breakableBlocks.add(this.below);
        }

        this.scene.time.delayedCall( 1000, () => { this.maybeChange() }, null, this);  
    }

    destroy() {
        this.free = true;
        this.body.enable = false;
        this.visible = false;
    }

    drop () {
        if (!this.below) return;
        this.below.body.moves = true;
        this.below.body.immovable = false;
        this.below.drop();
    }
}
