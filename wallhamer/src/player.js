
import Blow from "./blow";
import Brick from "./brick";

class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, health = 10) {
      super(scene, x, y, "walt")
      this.setOrigin(0.5)
      this.scene = scene;

      this.scene.add.existing(this);
      this.scene.physics.add.existing(this);
      this.cursor = this.scene.input.keyboard.createCursorKeys();
      this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.down = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
      this.right = true;
      this.body.setGravityY(100)
      this.body.setSize(48, 60)
      this.init();
      this.jumping = false;
      this.building = false;
      this.falling = false;
      this.mjolnir = false;

      this.health = health;

      this.dead = false;

      this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    init () {

        this.scene.anims.create({
            key: "startidle",
            frames: this.scene.anims.generateFrameNumbers("walt", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });

        this.scene.anims.create({
            key: "playeridle",
            frames: this.scene.anims.generateFrameNumbers("walt", { start: 2, end: 3 }),
            frameRate: 3,
            repeat: -1
        });

        this.scene.anims.create({
            key: "playerwalk",
            frames: this.scene.anims.generateFrameNumbers("walt", { start: 4, end: 6 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: "playerjump",
            frames: this.scene.anims.generateFrameNumbers("walt", { start: 4, end: 4 }),
            frameRate: 1,
        });

        this.scene.anims.create({
            key: "playerhammer",
            frames: this.scene.anims.generateFrameNumbers("walt", { start: 7, end: 8 }),
            frameRate: 10
        });

        this.scene.anims.create({
            key: "playerbuild",
            frames: this.scene.anims.generateFrameNumbers("walt", { start: 9, end: 10 }),
            frameRate: 10,
            repeat: 2
        });

        this.scene.anims.create({
            key: "playerdead",
            frames: this.scene.anims.generateFrameNumbers("walt", { start: 11, end: 16 }),
            frameRate: 5,
        });

        this.anims.play("startidle", true);

        this.on('animationcomplete', this.animationComplete, this);
    }    
  

    update () {
        if (this.dead) return;
        if (this.jumping ) {
           // if (Phaser.Math.Between(1,101) > 100) new Star(this.scene, this.x, this.y + 5)
            if (this.body.velocity.y >= 0) {
                this.body.setGravityY(600)
                this.falling = true;
            }
        }
        //if (Phaser.Input.Keyboard.JustDown(this.down)) {
        if ((Phaser.Input.Keyboard.JustDown(this.cursor.up) || Phaser.Input.Keyboard.JustDown(this.W)) && this.body.blocked.down) {
            // new Dust(this.scene, this.x, this.y)
            this.building = false;
            this.body.setVelocityY(-400);
            this.body.setGravityY(400)
            this.anims.play("playerjump", true);
            //this.scene.playAudio("chirp")
            this.jumping = true;

        } else if (this.cursor.right.isDown || this.D.isDown) {
            this.building = false;
            if (this.body.blocked.down) { this.anims.play("playerwalk", true); }
            this.right = true;
            this.flipX = (this.body.velocity.x < 0);
            this.body.setVelocityX(160);

        } else if (this.cursor.left.isDown || this.A.isDown) {
            this.building = false;
            if (this.body.blocked.down) { this.anims.play("playerwalk", true); }
            this.right = false;
            this.flipX = true;
            this.body.setVelocityX(-160);  

        } else {
            if (this.body.blocked.down) { 
                this.jumping = false;
                this.falling = false;

                if (!this.building)
                    this.anims.play("playeridle", true); 
            }

            this.body.setVelocityX(0)
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
            this.destroyBlock()
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursor.down) || Phaser.Input.Keyboard.JustDown(this.S)) {
            this.buildBlock()
        }

    }

    buildBlock() {
        this.building = true;
        this.anims.play("playerbuild", true);
        const offsetX = this.right ? 64 : -64;
        this.scene.bricks.add(new Brick(this.scene, this.x + offsetX, this.y))
    }

    destroyBlock() {
        this.building = true;
        this.anims.play("playerhammer", true); 
        const offsetX = this.right ? 32 : -32;
        const size = this.mjolnir ? 128 : 32;
        this.scene.blows.add(new Blow(this.scene, this.x + offsetX, this.y, size, size))
    }

    turn () {
        this.right = !this.right;
    }

    animationComplete (animation, frame) {
        if (animation.key === "playerground") {
            this.anims.play("playeridle", true)
        }

        if (animation.key === "playerhammer" || animation.key === "playerbuild" ) {
            console.log("Finished anim")
            this.building = false;
            this.anims.play(this.jumping ? "playerjump" : "playeridle", true);
        }
    }

    hitIce(ice) {
        this.currentIce = ice;

        if (this.jumping) {
            //this.scene.playAudio("hitice")
            Array(Phaser.Math.Between(1, 4)).fill(0).forEach( debris => {
               // new Debris(this.scene, this.x + (Phaser.Math.Between(-20, 20)), this.y + (Phaser.Math.Between(64, 80)), Phaser.Math.Between(25, 50) / 100);
            })
            this.scene.updateScore();
            this.anims.play("playerground", true);
            // new Star(this.scene, this.x, this.y - 5, 0, -100)
        }
    }

    hitFloor() {
        if (this.jumping) {
            ////this.scene.playAudio("ground")

            this.jumping = false;
        }
    }

    hit () {
        this.health--;
        this.anims.play("playerdead", true);
        this.body.enable = false;
        if (this.health === 0) {
            this.die();
        }

    }

    die () {
        this.dead = true;
        this.anims.play("playerdead", true);
        this.body.immovable = true;
        this.body.moves = false;
        // this.scene.updateHealth(0)
        this.scene.restartScene();
       // //this.scene.playAudio("gameover")
    }

    showFly () {
        this.healthBar.decrease(1)
        this.scene.tweens.add({
          targets: this.healthBar.bar,
          duration: 1000,
          alpha: {
            from: 1,
            to: 0
          },
        });
      }

}

export default Player;
  