import { Debris } from "./particle";

class Brick extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name="question") {
        super(scene, x, y, name);
        this.scene = scene;
        this.name = name;
        this.setOrigin(0, 0)

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.immovable = true;
        this.body.moves = false;
        this.activated = false;
     }

     activate () {
        this.activated = true;

        switch(Phaser.Math.Between(0,7)) {
            case 0: this.goLeft(); break;
            case 1: this.goRigth(); break;
            case 2: this.goUp(); break;
            case 3: this.goDown(); break;
            case 4: this.goLeft(); break;
            case 5: this.blow(); break;
            case 6: this.fall(); break;
            default: break;
        }
     }

     goLeft() {
        this.scene.tweens.add({
            targets: this,
            x: "-=50",
            duration: 1000,
            yoyo: true,
            repeat: -1
        })
     }

     goRigth() {
        this.scene.tweens.add({
            targets: this,
            x: "+=50",
            duration: 1000,
            yoyo: true,
            repeat: -1
        })
     }

     goUp() {
        this.scene.tweens.add({
            targets: this,
            y: "-=50",
            duration: 1000,
            yoyo: true,
            repeat: -1
        })
     }

     goDown() {
        this.scene.tweens.add({
            targets: this,
            y: "+=50",
            duration: 1000,
            yoyo: true,
            repeat: -1
        })
     }

     blow() {
        this.scene.playAudioRandomly("stone");
        Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this.scene, this.x, this.y))
        this.scene.regenerate(this.x, this.y)
        this.destroy()
     }

     fall() {
      this.scene.tweens.add({
         targets: this,
         x: "+=5",
         duration: 40,
         yoyo: true,
         repeat: 10,
         onComplete: () => {
            this.body.immovable = false;
            this.body.moves = true;
            this.body.setGravity(true)
            this.scene.regenerate(this.x, this.y)
         }
      })

     }
  }
  
  export default Brick;