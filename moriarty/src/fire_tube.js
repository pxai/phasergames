import { FireBurst, FireTongue } from "./steam";

class FireTube extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, side = "left") {
      super(scene, x, y, "fire");
      this.scene = scene;
      this.name = name;
      this.setOrigin(0.5)
      this.flipX = side !== "left";
      this.x += this.flipX ? 5 : 0;

      scene.add.existing(this);
      this.init();
  }

  init () {
      this.scene.tweens.add({
          targets: this,
          duration: 300,
          x: "-=8",
          yoyo: true,
          repeat: -1
      });

      this.scene.time.addEvent({ delay: 1000, callback: this.burst, callbackScope: this, loop: true });
  }

  burst () {
    new FireTongue(this.scene, this.x, this.y, this.flipX)
    Array(Phaser.Math.Between(10, 15)).fill(0).forEach((_, i) => {
      new FireBurst(this.scene, this.x, this.y, this.flipX)
    })
  }

}
  
  export default FireTube;