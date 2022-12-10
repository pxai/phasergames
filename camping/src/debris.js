export default class Debris extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y ) {
        super(scene, x, y, "debris", Phaser.Math.RND.pick([0, 1, 2, 3]))
       // this.setStrokeStyle(4, 0x000000);
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.body.setSize(24, 24)
        this.body.setAllowGravity(false);
        this.body.immovable = true;
    }
}