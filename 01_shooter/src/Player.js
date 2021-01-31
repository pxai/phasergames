export default class Player extends Phaser.GameObjects.Sprite {
    constructor (scene) {
        super(scene, 150, 250, "player");
        scene.add.existing(this);
        scene.physics.world.enableBody(this);
        // this.body.velocity.x = 300;
    }

    update () {
    }
}
