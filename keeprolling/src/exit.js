export default class Exit extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y) {
        super(scene, x, y, 64, 64, "0x00ff00")
        this.name = name;
        this.setOrigin(0)
        this.setAlpha(0)
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
    }
  }