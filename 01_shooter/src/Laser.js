class Laser extends Phaser.GameObjects.Sprite {
  constructor (scene) {
    const { x, y } = scene.ship;
    super(scene, x + 35, y, "laser");
    scene.bullets.add(this);
    scene.bullets.add(this);
    scene.add.existing(this);
    //this.play("laser_anim");
    scene.physics.world.enableBody(this);
    this.body.velocity.x = 300;
  }

  update(){
    if (this.x > scene.width) {
      this.destroy();
    }
 }
}