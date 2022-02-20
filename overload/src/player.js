
//import { LightParticle } from "./particle";
import Explosion from "./explosion";

class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name = "player") {
        super(scene, x, y, name);
        this.name = name;
        this.scene = scene;
        this.id = Math.random();
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(true);
        this.body.setCircle(26);
        this.body.setOffset(6, 9)
        this.power = 0;
        this.blinking = false;

        this.init();
    }

    init () {
        this.scene.anims.create({
            key: this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
          });
          this.scene.anims.create({
            key: this.name + "right",
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
          });
          this.scene.anims.create({
            key: this.name + "left",
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
          });
          this.anims.play(this.name, true)
        this.SPACE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.cursor = this.scene.input.keyboard.createCursorKeys();
        this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        
        this.upDelta = 0;
    }

    shoot () {
      //  this.scene.playAudio("shot")
     // this.shootingPatterns.shoot(this.x, this.y, this.powerUp)
     this.scene.explosions.add(new Explosion(this.scene, this.x, this.y + 50))
    }


    update (timestep, delta) {
        if (this.death) return;
        if (this.cursor.left.isDown) {
            this.x -= 5;
            //this.anims.play(this.name + "left", true)
        } else if (this.cursor.right.isDown) {
            this.x += 10;
           // this.anims.play(this.name + "right", true)
        }
    
        if (this.cursor.up.isDown) {
            this.y -= 5;
        } else if (this.cursor.down.isDown) {
            this.y += 5;
        }

        if (Phaser.Input.Keyboard.JustDown(this.SPACE)) {
            this.shoot();
        }
       // this.scene.trailLayer.add(new LightParticle(this.scene, this.x, this.y, 0xffffff, 10));
    }

    showPoints (score, color = 0xff0000) {
        let text = this.scene.add.bitmapText(this.x + 20, this.y - 30, "starshipped", score, 20, 0xfffd37).setOrigin(0.5);
        this.scene.tweens.add({
            targets: text,
            duration: 2000,
            alpha: {from: 1, to: 0},
            y: {from: text.y - 10, to: text.y - 100}
        });
    }

    dead () {
        const explosion = this.scene.add.circle(this.x, this.y, 10).setStrokeStyle(40, 0xffffff);
        this.scene.tweens.add({
            targets: explosion,
            radius: {from: 10, to: 512},
            alpha: { from: 1, to: 0.3},
            duration: 300,
            onComplete: () => { explosion.destroy() }
        })
        this.scene.cameras.main.shake(500);
        this.death = true;
        this.shadow.destroy();
        new Explosion(this.scene, this.x, this.y, 40)
        super.destroy();
    }     
}




export default Player;
