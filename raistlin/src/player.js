export default class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, bounce = 0.5) {
        super(scene, x, y, "player")
        this.setScale(1.2)
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.scene = scene;
        this.body.setImmovable(false)
        this.body.setAllowGravity(false);
        this.init();
    }
  
    init () {
      this.scene.tweens.add({
        targets: this,
        duration: 1000,
        y: { from: this.y, to: this.y - 5 },
        repeat: -1,
        yoyo: true
      })
    }
  }