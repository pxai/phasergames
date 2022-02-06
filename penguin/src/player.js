import Cloud from "./ice";
import Block from "./block";

class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, health = 10) {
      super(scene, x, y, "penguin")
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
      this.walking = false;
      this.slippery = false;
      this.extraJumps = 1;
      this.extraFlap = 10;
      this.wobble = null;
      this.health = health;
      this.currentIce = null;
      this.wallGrow = 16;
    }

    init () {

        this.scene.anims.create({
            key: "playeridle",
            frames: this.scene.anims.generateFrameNumbers("penguin", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });

        this.scene.anims.create({
            key: "playerwalk",
            frames: this.scene.anims.generateFrameNumbers("penguin", { start: 2, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: "playerjump",
            frames: this.scene.anims.generateFrameNumbers("penguin", { start: 4, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: "playerground",
            frames: this.scene.anims.generateFrameNumbers("penguin", { start: 6, end: 6 }),
            frameRate: 1,
        });

        this.anims.play("playeridle", true);

        this.on('animationcomplete', this.animationComplete, this);
    }    
  
    addWobble() {
        if (this.wobble !== null) return;
        this.wobble = this.scene.tweens.add({
            targets: this,
            rotation: "+=0.08",
            yoyo: true,
            duration: 100,
            repeat: -1
        })
    }

    update () {
        if (this.jumping && Phaser.Input.Keyboard.JustDown(this.cursor.up) && this.body.velocity.y < 0 && this.extraJumps > 0) {
            this.body.velocity.y -= 200;
            console.log("Extra jump!")

            this.extraJumps--;
            if (this.currentIce) this.currentIce.occupied = false;
        } else if (this.jumping && this.cursor.up.isDown && this.body.velocity.y >= 0 && this.extraFlap > 0) {
            this.body.setVelocityY(-50)
            this.extraFlap--;
        } else if (this.jumping ) {
            if (this.body.velocity.y >= 0) {
                this.body.setGravityY(600)
            }
        }
        //if (Phaser.Input.Keyboard.JustDown(this.down)) {
        if (Phaser.Input.Keyboard.JustDown(this.cursor.up) && this.body.blocked.down) {
            this.stopWobble();
            this.body.setVelocityY(-600);
            this.body.setGravityY(400)
            this.anims.play("playerjump", true);
            console.log("Normal jump!", this.x, this.y)
           // this.scene.playAudio("jump")
            this.jumping = true;

        } else if (this.cursor.right.isDown) {
            if (this.body.blocked.down) { this.anims.play("playerwalk", true); this.addWobble();}
            this.right = true;
            this.flipX = (this.body.velocity.x < 0);
            this.body.setVelocityX(160);
            this.slippery = true;
        } else if (this.cursor.left.isDown) {
            if (this.body.blocked.down) { this.anims.play("playerwalk", true); this.addWobble();}
            this.right = false;
            this.flipX = (this.body.velocity.x < 0);
            this.body.setVelocityX(-160);  
            this.slippery = true;
        } else {
           this.stopWobble();
            if (this.body.blocked.down) { 
                if (this.slippery) {
                    const direction = (this.body.velocity.x < 0) ? -1 : 1;
                    this.body.setVelocityX(100 * direction);
                    this.body.setDrag(100);
                    this.slippery = false;
                }

                this.jumping = false;

               if (this.anims.getName() === "playerjump") this.anims.play("playerground", true); 
               if (this.anims.getName() === "playerwalk") this.anims.play("playeridle", true); 
                this.extraJumps = 1;
                this.extraFlap = 10;
            }

        }


    }

    growTiles () {
        console.log("Growing tiles!")
        for (let i = 0; i < 16; i++) {
            this.scene.platform.add(new Block(this.scene, -7 * 64, this.wallGrow * -64, Phaser.Math.Between(0, 1)))
            this.scene.platform.add(new Block(this.scene, 7 * 64, this.wallGrow * -64, Phaser.Math.Between(0, 1)))
            this.wallGrow++;
        }
    }

    stopWobble () {
        if (this.wobble) {this.wobble.remove(); this.rotation = 0;this.wobble = null;}
    }
    turn () {
        this.right = !this.right;
    }

    animationComplete (animation, frame) {
        console.log("finished?")
        if (animation.key === "playerground") {
            console.log("Ok, lets go")
            this.anims.play("playeridle", true)
        }
    }

    hitIce(ice) {
        this.currentIce = ice;

        if (this.jumping) {
            this.anims.play("playerground", true);
            this.growTiles();
        }
    }

    hitFloor() {
        if (this.jumping) {
            //this.scene.playAudio("ground")

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
        this.body.immovable = true;
        this.body.moves = false;
        this.scene.updateHealth(0)
        this.scene.gameOver();
        //this.anims.play("playerdead" + this.number)
       // this.scene.playAudio("gameover")
    }

}

export default Player;
  