import Pot from "./pot";
import Dust from "./dust";


class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name) {
      super(scene, x, y, "wizard")
      this.setOrigin(0.5)
      this.scene = scene;
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
    }

    init () {
        this.scene.anims.create({
            key: "playeridle",
            frames: this.scene.anims.generateFrameNumbers("wizard", { start: 0, end: 1 }),
            frameRate: 1,
            repeat: -1
        });

        this.scene.anims.create({
            key: "playerwalkidle",
            frames: this.scene.anims.generateFrameNumbers("wizard", { start: 5, end: 5 }),
            frameRate: 1,
        });

        this.scene.anims.create({
            key: "playerwalk",
            frames: this.scene.anims.generateFrameNumbers("wizard", { start: 5, end: 8 }),
            frameRate: 5,
        });

        this.scene.anims.create({
            key: "playercast",
            frames: this.scene.anims.generateFrameNumbers("wizard", { start: 9, end: 13 }),
            frameRate: 5,
        });

        this.scene.anims.create({
            key: "playerjump",
            frames: this.scene.anims.generateFrameNumbers("wizard", { start: 14, end: 15 }),
            frameRate: 5,
        });

        this.scene.anims.create({
            key: "playerdead",
            frames: this.scene.anims.generateFrameNumbers("wizard", { start: 16, end: 20 }),
            frameRate: 5,
        });

        this.anims.play("playeridle", true);
        this.on("animationupdate" , this.castInTime, this);
        this.on('animationcomplete', this.animationComplete, this);
    }    
  
    update() {
        if (this.casting) return;
        if (Phaser.Input.Keyboard.JustDown(this.down) && this.pots.length) {
            this.body.setVelocityX(0);
            this.casting = true;
            this.anims.play("playercast", true);
            this.scene.playAudio("cast1")
        } else if (this.cursor.up.isDown && this.body.blocked.down) {
            this.body.setVelocityY(-300);
            this.anims.play("playerjump", true);
            this.scene.playAudio("jump")
            new Dust(this.scene, this.x, this.y)
            this.jumping = true;
        } else if (this.cursor.right.isDown) {
            if (this.body.blocked.down) { this.anims.play("playerwalk", true); }
            this.right = true;
            this.flipX = (this.body.velocity.x < 0);
            this.body.setVelocityX(160);
        } else if (this.cursor.left.isDown) {
            if (this.body.blocked.down) { this.anims.play("playerwalk", true); }
            this.right = false;
            this.flipX = (this.body.velocity.x < 0);
            this.body.setVelocityX(-160);  
        } else {
            if (this.body.blocked.down) { this.anims.play("playerwalkidle", true); }
            this.body.setVelocityX(0);
        }
    }

    usePot() {
        const pot = this.pots.pop();
        new Pot(this.scene, this.x, this.y - 20, pot.name, pot.color, true);
        this.scene.removePot(pot);
        const current = this.pots.length > 0 ? this.pots[this.pots.length-1].name : "";
        this.scene.changeSelectedPot(pot.name, current)
    }

    animationComplete (animation, frame) {
        if (animation.key === "playercast") {
            this.casting = false;
            this.anims.play("playeridle", true);
            this.scene.playAudio("cast2")
        }
    }

    castInTime(animation, frame) {
        if (animation.key === "playercast" && frame.index === 4) {
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
  }

export default Player;
  