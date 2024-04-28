class Blow extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "tnt");
    const radius = Phaser.Math.Between(75, 150);
    this.setOrigin(0.5)
    this.scene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.setCircle(radius);
    this.setAlpha(0)
    this.scene.tweens.add({
      targets: this,
      duration: 300,
      scale: { from: 1, to: 0 },
      onComplete: () => {
        this.destroy();
      },
    });
  }
}

export default Blow;
