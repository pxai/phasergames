class Bat extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y) {
      super(scene, x, y, "bat");
      this.scene = scene;
      this.x = x;
      this.y = y;

      this.setTween();
      scene.add.existing(this);
      scene.physics.add.existing(this);

      this.body.immovable = true;
      this.body.moves = false;
  
      const potAnimation = this.scene.anims.create({
          key: "bat",
          frames: this.scene.anims.generateFrameNumbers("bat", { start: 0, end: 1 }, ),
          frameRate: 5
      });
      this.play({ key: "bat", repeat: -1 });
      this.body.setVelocityX(200)
      this.body.setVelocityY(200)
   }

  setTween () {
    /*
      this.scene.tweens.add({
        targets: this,
        duration: 500,
        y: this.y - 20,
        repeat: -1,
        yoyo: true
      })  
    */
  }

  disable () {
      this.visible = false;
      this.destroy();
  } 

  destroy() {
      super.destroy();
  }
}

export default Bat;
