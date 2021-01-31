export default class Foe extends Phaser.GameObjects.Sprite {
    constructor (scene, width, height) {
        const x = width;
        const y = Phaser.Math.Between(0, height);
        super(scene, x, y, "foe");
        scene.foes.add(this);
        scene.add.existing(this);
        scene.physics.world.enableBody(this);
        this.body.velocity.x = -200;
    }

    update () {
        if (this.x < 0) {
            this.destroy();
        }
    }
}
