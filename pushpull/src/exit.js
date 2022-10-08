export default class Exit extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "star") {
        super(scene, x, y, "star")
        this.name = name;
        this.setOrigin(0.5)
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        scene.tweens.add({
            targets: this,
            scale: {from: 0.9, to: 1},
            y: "-=5",
            yoyo: true,
            repeat: -1,
            duration: 300
        })
    }
  }