export default class Tile extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, color = 0xffffff, size = 4) {
    super(scene, x, y, size, size, color);
    this.setOrigin(0)
    this.scene = scene;

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
  }
}