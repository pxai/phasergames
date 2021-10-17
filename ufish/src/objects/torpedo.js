import Bubble from "./bubble";

class Torpedo extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "torpedo", velocity = 1, direction) {
        super(scene, x, y, name);
        this.name = name;
        this.scene = scene;
        this.setOrigin(0.5)

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.direction = direction || Phaser.Math.Between(0, 1) ? -1 : 1;
        this.body.setVelocityX(300 * this.direction * velocity);
        this.flipX = this.direction > 0;

        this.collider = this.scene.physics.add.overlap(this.scene.player, this, this.scene.player.hit, null, this.scene.player);
        this.overlapBulletBeam = this.scene.physics.add.overlap(this.scene.player.beamGroup, this, this.scene.player.destroyBeam);
    }

    update () {
        if (Phaser.Math.Between(1, 2) > 1) {
            new Bubble(this.scene, this.x - (this.direction * 34), this.y,  50, -1)
        }
    }
}

export default Torpedo;
