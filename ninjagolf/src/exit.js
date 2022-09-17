export default class Exit extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name) {
        super(scene, x, y, "shogun")
        this.name = name;
        this.setAlpha(1)
        this.setOrigin(0);
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
    }
  }