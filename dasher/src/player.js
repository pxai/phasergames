class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, number) {
      super(scene, x, y, "player")
      this.setOrigin(0.5)
      this.setScale(1)
      this.scene = scene;
      this.scene.add.existing(this);
      this.scene.physics.add.existing(this);
      this.body.collideWorldBounds = true;

      this.body.setSize(50, 59)
      this.right = false;
      this.init();
      this.casting = false;
      this.pots = [];
      this.currentPot = 0;
      this.potTypes = 3;
      this.jumping = false;
      this.frozen = false;
      this.escaping = false;
      this.tmpDisabled = false;
      this.powered = false;
      this.dead = false;

    }


    powerUp(){
        this.powered = true;
        this.tmpDisabled = true;
        this.scene.tweens.add({
            targets: this,
            scale: { from: 1, to: 1.4},
            duration: 500
        },{
            targets: this,
            alpha: { from: 0.5, to: 1},
            duration: 500,
            repeat: 20,
            onComplete: () => {
                this.tmpDisabled = false;
            }
        })
    }

    powerDown () {
        this.tmpDisabled = true;
        this.powered = false;
        this.scene.tweens.add({
            targets: this,
            scale: { from: 1.4, to: 1},
            duration: 500
        },{
            targets: this,
            alpha: { from: 0.5, to: 1},
            duration: 500,
            repeat: 20
        },{
            targets: this,
            alpha: { from: 0.5, to: 1},
            duration: 100,
            repeat: 20,
        })
        this.scene.time.delayedCall(1000, () => {this.tmpDisabled = false;}, null, this)
    }

    init () {
        this.scene.anims.create({
            key: "playeridle",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 0, end:5 }),
            frameRate: 1,
            repeat: -1
        });

        this.scene.anims.create({
            key: "playerwalkidle",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 0, end: 5 }),
            frameRate: 1,
        });

        this.scene.anims.create({
            key: "playerwalk",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 6, end: 7 }),
            frameRate: 5,
        });

        this.scene.anims.create({
            key: "playerjump",
            frames: this.scene.anims.generateFrameNumbers("player", { start:8, end: 8 }),
            frameRate: 5,
        });

        this.anims.play("playeridle", true);

        this.on('animationcomplete', this.animationComplete, this);

    }    
  
    update() {
        this.playerMove(); 
    }

    playerMove () {
        if (this.dead) return;
       

     }


    turn () {
        this.right = !this.right;
    }


    animationComplete (animation, frame) {
        if (animation.key === "playercast" + this.number) {
            this.casting = false;
            this.anims.play("playeridle" + this.number, true);
            this.scene.playAudio("cast2")
        }

        if (animation.key === "playerdead" + this.number) {
            this.scene.scene.start('game_over')
        }
    }

  }

export default Player;
  