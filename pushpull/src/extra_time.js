class ExtraTime extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, name = "heart", color = "0xffffff") {
      super(scene, x, y, name);
      this.scene = scene;
      this.color = color;
      this.x = x;
      this.y = y;
      this.name = name;
      this.setTween();
      scene.add.existing(this);
      scene.physics.add.existing(this);

      this.body.immovable = true;
      this.body.moves = false;
      const potAnimation = this.scene.anims.create({
        key: this.name,
        frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 1 }, ),
        frameRate: 5
      });
    this.play({ key: this.name, repeat: -1 });
   }

  /*

  */
  setTween () {
    this.scene.tweens.add({
      targets: this,
      duration: 500,
      y: this.y - 20,
      repeat: -1,
      yoyo: true
    })
  }

}

export default ExtraTime;
