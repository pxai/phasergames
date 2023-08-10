export default class Brick extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, name = "bricks") {
    super(scene, x, y, name,Phaser.Math.Between(0, 10));
    this.name = name;

    this.scene = scene;
    this.setOrigin(1);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.collideWorldBounds = true;
    this.body.setAllowGravity(false)
    this.body.setImmovable(true)

  }
}