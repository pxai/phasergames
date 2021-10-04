import StarBurst from "./starburst";

class Pot extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, name, color = "0xffffff", launch = false) {
      super(scene, x, y, name);
      this.scene = scene;
      this.color = color;
      this.x = x;
      this.y = y;
      this.name = name;
      this.setTween(launch);
      scene.add.existing(this);
      scene.physics.add.existing(this);

      this.body.immovable = true;
      this.body.moves = false;
  
      const potAnimation = this.scene.anims.create({
          key: this.name,
          frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 6 }, ),
          frameRate: 5
      });
      this.play({ key: this.name, repeat: -1 });
   }

  setTween (launch) {
    if (launch) {

      this.scene.tweens.add({
        targets: this,
        duration: 200,
        y: this.y - 70,
        alpha: { from: 1, to: 0 },
        onComplete: () => {
          new StarBurst(this.scene, this.x, this.y, this.color, true);
          this.disable();
      },
      })  
    } else {
      this.scene.tweens.add({
        targets: this,
        duration: 500,
        y: this.y - 20,
        repeat: -1,
        yoyo: true
      })  
    }
  }

  disable () {
      this.visible = false;
      this.destroy();
  } 

  destroy() {
      super.destroy();
  }
}

export default Pot;
