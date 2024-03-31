export default class Exit extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, width = 1200, height = 32) {
        super(scene, x, y, width, height)
        this.name = "exit";
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
    }
  }
