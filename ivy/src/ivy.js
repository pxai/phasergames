export default class Ivy extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'plant', 0);
    this.setOrigin(0)
    this.scene = scene;

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.init()
  }

  init () {
    console.log('Got here Ivy');

  }

}