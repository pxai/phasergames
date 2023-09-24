
export default class Foe extends Phaser.GameObjects.Container  {
    constructor (scene, x, y, grid) {
        super(scene, x, y);
        this.name = "ghost";
        this.setScale(1)
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setSize(64, 64)
        this.sprite = this.scene.add.sprite(0, 0 , "ghost");
        this.sprite.setOrigin(0)
        this.shadow = this.scene.add.sprite(12, 64, "shadow");
        this.shadow.setOrigin(0)
        this.harmless = true;
        this.add(this.shadow);
        this.add(this.sprite);
        this.scene.time.delayedCall(1000, () => { this.harmless = false }, null, this);

       this.init();
    }

    init () {
      this.scene.events.on("update", this.update, this);
        this.scene.tweens.add({
            targets: this,
            duration: 500,
            repeat: -1,
            scale: {from: 0.95, to: 1},
            yoyo: true
        })

        this.scene.anims.create({
            key: this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
          });

          this.scene.anims.create({
            key: this.name + "death",
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 0, end: 2 }),
            frameRate: 5
          });

          this.sprite.anims.play(this.name, true)
          //this.body.setVelocityX(this.direction * 100);
          this.flipX = this.direction < 0;
          this.on('animationcomplete', this.animationComplete, this);

          console.log("Created ghost")
          this.move();
    }


    move () {
      const distance = Phaser.Math.Distance.BetweenPoints(this.scene.player, this);
      this.scene.physics.moveTo(this, this.scene.player.x, this.scene.player.y, 100);
  }



    update () {
      if(!this.active) return;
      if (Phaser.Math.Between(0, 100) > 80) {
        this.move();
      }
    }

    turn () {
        this.direction = -this.direction;
        this.flipX = this.direction < 0;
        this.body.setVelocityX(this.direction * 100);
    }

    death () {
      //this.delayedMove.stop();
        this.moveTimeline.destroy();
        this.dead = true;
        this.body.enable = false;
        this.body.rotation = 0;
        //this.anims.play(this.name + "death")
        this.destroy();
      }

      animationComplete(animation, frame) {
        if (animation.key === this.name +"death") {
          //this.destroy()
        }
    }

    freeze () {
      this.setAlpha(0);
      this.delayedMove.remove();
      this.body.enable = false;
      this.scene.time.delayedCall(5000, () => {
        this.setAlpha(1);
        this.body.enable = true;
        this.delayedMove.paused = false;
        this.launchMove();
      }, null, this);
    }
}

