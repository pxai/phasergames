class Blow extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y) {
    const width = Phaser.Math.Between(150, 250);
    super(scene, x, y, width, width, 0xffffff);
    this.setOrigin(0.5)
    this.scene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.setAlpha(1)
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
