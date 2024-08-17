class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, health = 10) {
        super(scene, x, y, "player1")
        this.setOrigin(0.5)
        this.scene = scene;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.right = true;
        this.body.setGravityY(100)

        this.jumping = false;
        this.building = false;
        this.falling = false;
        this.mjolnir = false;
        this.walkVelocity = 200;
        this.jumpVelocity = -400;
        this.invincible = false;
        this.bullets = 6;
        this.loading = false;
        this.isOnPlatform = false;
        this.health = health;

        this.dead = false;
        this.setControls()
        this.init();
    }

    setControls() {
      this.cursor = this.scene.input.keyboard.createCursorKeys();
      this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }


    init () {
      this.scene.tweens.add({
          targets: this,
          scaleX: {from: 1, to: 0.95},
          repeat: -1,
          duration: 100,
          yoyo: true,
      })
      this.scene.events.on("update", this.update, this);
  }


    update () {
        if (this.y > 1500 && this.scene.number !== 3) this.die();
        if (this.dead) return;
        if (this.jumping ) {
           // if (Phaser.Math.Between(1,101) > 100) new Star(this.scene, this.x, this.y + 5)
            if (this.body.velocity.y >= 0) {
                this.body.setGravityY(700)
                this.falling = true;
            }
        }
        //if (Phaser.Input.Keyboard.JustDown(this.down)) {Phaser.Input.Keyboard.JustDown(this.W)
        if (Phaser.Input.Keyboard.JustDown(this.cursor.up) && (this.body.blocked.down || this.isOnPlatform )) {
            this.body.setAllowGravity(true);
            this.body.setImmovable(false);
            this.isOnPlatform = false;
            this.body.setVelocityY(this.jumpVelocity);
            this.body.setGravityY(400)
            // this.anims.play("playerjump", true);
            // this.scene.playAudio("jump")
            // this.jumping = true;
            // this.jumpSmoke();

        } else if (this.cursor.right.isDown) {
            this.right = true;
            this.flipX = (this.body.velocity.x < 0);
            this.body.setVelocityX(this.walkVelocity);

        } else if (this.cursor.left.isDown) {
            //if (this.body.blocked.down) { this.anims.play("playerwalk", true); }
            this.right = false;
            this.flipX = true;
            this.body.setVelocityX(-this.walkVelocity);

        } else {
            if (this.body.blocked.down) {
               // if (this.jumping) {this.scene.playAudio("land");this.landSmoke();}
                this.jumping = false;
                this.falling = false;

                //if (!this.building) this.anims.play("playeridle", true);
            }

            this.body.setVelocityX(0)
        }
    }


    turn () {
        this.right = !this.right;
    }

    animationComplete (animation, frame) {
        if (animation.key === "playerground") {
            this.anims.play("playeridle", true)
        }

        if (animation.key === "playerhammer" || animation.key === "playerbuild" ) {
            this.building = false;
            this.anims.play(this.jumping ? "playerjump" : "playeridle", true);
        }
    }

    hitFloor() {
        if (this.jumping) {
            ////this.scene.playAudio("ground")

            this.jumping = false;
        }
    }

    die () {
        this.dead = true;
        //this.anims.play("playerdead", true);
        this.body.immovable = true;
        this.body.moves = false;
        this.scene.restartScene();
    }
}

export default Player;
