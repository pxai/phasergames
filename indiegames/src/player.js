class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, number) {
      super(scene, x, y, "player")
      this.setOrigin(0.5)
      this.setScale(0.7)
      this.scene = scene;
      this.scene.add.existing(this);
      this.scene.physics.add.existing(this);
      this.body.collideWorldBounds = true;
      this.cursor = this.scene.input.keyboard.createCursorKeys();

      this.right = false;
      this.init();
      this.casting = false;
      this.pots = [];
      this.currentPot = 0;
      this.potTypes = 3;
      this.jumping = false;
      this.frozen = false;
      this.escaping = false;
      this.invincible = false;
      this.health = 10;
      this.body.setGravity(100)
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
 
        if (this.cursor.down.isDown) {
            this.body.setVelocityX(0);
        } else if (this.cursor.up.isDown && this.body.blocked.down) {
            this.body.setVelocityY(-450);
            this.anims.play("playerjump", true);
            this.scene.playAudio("jump")
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
            if (this.body.blocked.down) { 
                this.anims.play("playerwalkidle", true); }
            this.body.setVelocityX(0);
        }

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
  