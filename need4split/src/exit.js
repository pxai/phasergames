export default class Exit extends Phaser.GameObjects.Rectangle {
    constructor (scene, x, y, width = 30, height = 1200) {
        super(scene, x, y, width, height)
        this.name = "exit";
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
    }
  }
