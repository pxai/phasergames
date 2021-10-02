import Pot from "./pot";
import Dust from "./dust";


class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, number) {
      super(scene, x, y, "wizard")
      this.setOrigin(0.5)
      this.scene = scene;
      this.number = number; 
      this.scene.add.existing(this);
      this.scene.physics.add.existing(this);
      this.body.collideWorldBounds = true;
      this.cursor = this.scene.input.keyboard.createCursorKeys();
      this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.down = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

      this.right = false;
      this.init();
      this.casting = false;
      this.pots = [];
      this.currentPot = 0;
      this.potTypes = 3;
      this.jumping = false;
      this.frozen = false;
    }

    init () {
        this.scene.anims.create({
            key: "playeridle" + this.number,
            frames: this.scene.anims.generateFrameNumbers("wizard", { start: 0, end: 1 }),
            frameRate: 1,
            repeat: -1
        });

        this.scene.anims.create({
            key: "playerwalkidle" + this.number,
            frames: this.scene.anims.generateFrameNumbers("wizard", { start: 5, end: 5 }),
            frameRate: 1,
        });

        this.scene.anims.create({
            key: "playerwalk" + this.number,
            frames: this.scene.anims.generateFrameNumbers("wizard", { start: 5, end: 8 }),
            frameRate: 5,
        });

        this.scene.anims.create({
            key: "playercast" + this.number,
            frames: this.scene.anims.generateFrameNumbers("wizard", { start: 9, end: 13 }),
            frameRate: 5,
        });

        this.scene.anims.create({
            key: "playerjump" + this.number,
            frames: this.scene.anims.generateFrameNumbers("wizard", { start: 14, end: 15 }),
            frameRate: 5,
        });

        this.scene.anims.create({
            key: "playerdead" + this.number,
            frames: this.scene.anims.generateFrameNumbers("wizard", { start: 16, end: 20 }),
            frameRate: 5,
        });

        this.anims.play("playeridle" + this.number, true);
        this.on("animationupdate" , this.castInTime, this);
        this.on('animationcomplete', this.animationComplete, this);
        console.log("This-.number: ", this.number);
        if (this.number > 0) { 
            const initMove = Phaser.Math.Between(-1, 1) > 0 ? 1 : -1;
            this.right = initMove === 1;
            this.body.setVelocityX(initMove * 160);
            this.flipX = (this.body.velocity.x < 0);
            console.log("Init move:", this.body.velocity.x);
        }
    }    
  
    update() {
        if (this.casting) return;
        if (!this.number) { 
            this.playerMove(); 
        } else {
            this.mirrorMove();
        }

    }

    playerMove () {
 
        if (Phaser.Input.Keyboard.JustDown(this.down) && this.pots.length) {
            this.body.setVelocityX(0);
            this.casting = true;
            this.anims.play("playercast" + this.number, true);
            this.scene.playAudio("cast1")
        } else if (this.cursor.up.isDown && this.body.blocked.down) {
            this.body.setVelocityY(-300);
            this.anims.play("playerjump" + this.number, true);
            this.scene.playAudio("jump")
            new Dust(this.scene, this.x, this.y)
            this.jumping = true;
        } else if (this.cursor.right.isDown) {
            if (this.body.blocked.down) { this.anims.play("playerwalk" + this.number, true); }
            this.right = true;
            this.flipX = (this.body.velocity.x < 0);
            this.body.setVelocityX(160);
        } else if (this.cursor.left.isDown) {
            if (this.body.blocked.down) { this.anims.play("playerwalk" + this.number, true); }
            this.right = false;
            this.flipX = (this.body.velocity.x < 0);
            this.body.setVelocityX(-160);  
        } else {
            if (this.body.blocked.down) { this.anims.play("playerwalkidle" + this.number, true); }
            this.body.setVelocityX(0);
        }

        //const scrol_x = this.x - this.scene.center_width;     
 ///  scrollX - Х top left point of camera
      //  this.scene.cameras.main.x = scrol_x;
    }

    mirrorMove() {
        if (this.frozen) return;
        if (this.body) {
            if (this.body.onFloor()) {
                let initMove = this.right ? 1 : -1;
                this.body.setVelocityX(initMove * 160);
                this.play("playerwalk" + this.number, true);
                if (Phaser.Math.Between(1,101) > 100) {
                    this.body.setVelocityX(initMove * 160);
                    this.body.setVelocityY(-300);
                    this.scene.playAudio("jump")
                    new Dust(this.scene, this.x, this.y)
                    this.jumping = true;
                }

                if (Phaser.Math.Between(1,101) > 100) {
                    this.right = !this.right;
                    this.flipX = (this.body.velocity.x < 0);
                }

            } else { // fall
                this.play("playerjump" + this.number, true);
            }
            this.flipX = (this.body.velocity.x < 0);
        }
    }

    usePot() {
        const pot = this.pots.pop();
        new Pot(this.scene, this.x, this.y - 20, pot.name, pot.color, true);
        this.scene.removePot(pot);
        const current = this.pots.length > 0 ? this.pots[this.pots.length-1].name : "";
        this.scene.changeSelectedPot(pot.name, current)
        this.scene.applyPot(pot);
    }

    animationComplete (animation, frame) {
        if (animation.key === "playercast" + this.number) {
            this.casting = false;
            this.anims.play("playeridle" + this.number, true);
            this.scene.playAudio("cast2")
        }
    }

    castInTime(animation, frame) {
        if (animation.key === "playercast" + this.number && frame.index === 4) {
            this.usePot();
        }
    }

    hitFloor() {
        if (this.jumping) {
            this.scene.playAudio("ground")
            console.log("Player pos: ", this.body.position.y);

            this.jumping = false;
        }
    }

    startFloat () {
        this.scene.weezardSpawn.playerCollider.destroy()
        this.scene.weezardSpawn.startFloat();
        /*this.invisibleEffect = this.scene.tweens.add({
            targets: this,
            duration: 200,
            alpha: { from: 0, to: 1},
            repeat: -1,
            yoyo: true
        })*/
        console.log("unvisible!!!", this.number);
    }

    stopFloat () {
        this.scene.weezardSpawn.stopFloat();
        // this.scene.tweens.remove(this.invisibleEffect);
        this.scene.weezardSpawn.createPlayerCollider()
        console.log("visible!!!", this.number);
    }

    freeze () {
        console.log("YEA!!!", this.number);
        this.body.setVelocityX(0);
        this.body.setVelocityY(0);
        this.body.enable = false;
        this.frozen = true;
    }

    unfreeze () {
        console.log("UNFROZEN!!!", this.number);
        this.body.enable = true;
        this.frozen = false;
    }

    fly () {
        this.frozen = true;
        this.flyTween = this.scene.tweens.add({
            targets: this,
            duration: 10000,
            y: { from: this.y, to: -100},
        })
    }

    backToLand () {
        this.frozen = false;
        this.scene.tweens.remove(this.flyTween);
        this.body.enable = true;
    }
  }

export default Player;
  