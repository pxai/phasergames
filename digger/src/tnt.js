export class Tnt extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y, "tnt");
        this.name = "tnt";
        this.scene = scene;
        this.scene.physics.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        this.scene.add.existing(this);

        this.init();
    }

    init () {
        console.log("TNT> Added TNT!!")
    }
}

export class TntActivator extends  Phaser.GameObjects.Rectangle {
    constructor (scene, x, y) {
        super(scene, x, y, 32, 32, 0x000000)
        this.setAlpha(1)
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
    }
}