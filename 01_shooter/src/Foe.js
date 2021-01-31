class Foe extends Phaser.GameObjects.Sprite {
  constructor (scene, config) {
    const x = 400;
    const y = Phaser.Math.Between(0, config.height);
    console.log("And: ", y);
    super(scene, x, y, "foe");
    scene.foes.add(this);
    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    this.body.velocity.x = -200;
  }

  update(){
    if (this.x < 0) {
      this.destroy();
    }
 }
}