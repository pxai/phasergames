export default class Laser extends Phaser.GameObjects.Sprite {
    constructor (scene, width) {
        const { x, y } = scene.player;
        super(scene, x + 35, y, "laser");
        scene.bullets.add(this);
        scene.add.existing(this);
        this.play("laser_anim");
        scene.physics.world.enableBody(this);
        this.body.velocity.x = 300;
        this.width = width;
    }

    update () {
        if (this.x > this.width) {
            this.destroy();
        }
    }
}
