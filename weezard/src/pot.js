import StartBurst from "./starburst";
import StarBurst from "./starburst";

class Pot extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, name) {
      super(scene, x, y, name);
      this.scene = scene;
      this.x = x;
      this.y = y;
      this.name = name;
      this.setTween();
      scene.add.existing(this);
      scene.physics.add.existing(this);

      this.body.immovable = true;
      this.body.moves = false;
  
      const potAnimation = this.scene.anims.create({
          key: "potspin",
          frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 6 }, ),
          frameRate: 5
      });
      this.play({ key: "potspin", repeat: -1 });
      this.overlap = this.scene.physics.add.overlap(this.scene.player, this, this.pick, null, this.scene);
  }

  setTween () {
      this.scene.tweens.add({
          targets: this,
          duration: 500,
          y: this.y - 20,
          repeat: -1,
          yoyo: true
      })   
  }

  pick (player, pot) {
      this.starBurst = new StarBurst(pot.scene, pot.x, pot.y);
      pot.disable();
  }

  disable () {
      this.visible = false;
      this.overlap.active = false;
  } 

  enableAgain () {
      this.visible = true;
      this.overlap.active = true;
  }

  destroy() {
      super.destroy();
  }
}

export default Pot;
