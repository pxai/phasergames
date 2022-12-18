import Lit from "./lit";

class Bulb extends Phaser.GameObjects.Sprite {
  constructor (scene, x, y, name = "bulb", color = "0xffffff") {
      super(scene, x, y, name, 0);
      this.scene = scene;
     // this.color = color;
      this.setOrigin(0)
      this.x = x;
      this.y = y;
      this.name = name;
      //this.setTween();
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.activated = false;

      this.body.immovable = true;
      this.body.moves = false;
      const potAnimation = this.scene.anims.create({
        key: this.name,
        frames: this.scene.anims.generateFrameNumbers(this.name, { start: 1, end: 2 }, ),
        frameRate: 5
      });
    //this.play({ key: this.name, repeat: -1 });
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

  activate () {
    this.tint = 0xffffff
    this.activated = true;
    this.play({ key: this.name, repeat: -1 });
    this.scene.checkAll();
    //new Lit(this.scene, this.x, this.y)
    this.scene.lights.addPointLight(this.x + 16, this.y + 16, 0xfffd00, 40, .3)
   // this.bulbLight = this.scene.lights.addLight(this.x, this.y, 200).setColor(0xffffff).setIntensity(3.0);
  }

  deactivate () {
    this.clearTint()
    this.stop({key: this.name})
    this.activated = false;
  }

}

export default Bulb;
