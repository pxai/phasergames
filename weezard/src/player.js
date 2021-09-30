class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name) {
      super(scene, x, y, "wizard")
      this.setOrigin(0.5)
      this.scene = scene;
      this.scene.add.existing(this);
      this.scene.physics.add.existing(this);
      this.body.collideWorldBounds = true;
      this.isFilled = false;
      this.isStroked = true;
      this.lineWidth = 5;
      this.strokeColor = 0x00dd00;
      this.cursor = this.scene.input.keyboard.createCursorKeys();
      this.right = false;
      this.init();
      this.casting = false;
    }

    init () {
        this.scene.anims.create({
            key: "playeridle",
            frames: this.scene.anims.generateFrameNumbers("wizard", { start: 0, end: 1 }),
            frameRate: 1,
            repeat: -1
        });

        this.scene.anims.create({
            key: "playerwalk",
            frames: this.scene.anims.generateFrameNumbers("wizard", { start: 5, end: 8 }),
            frameRate: 5,
        });

        this.scene.anims.create({
            key: "playercast",
            frames: this.scene.anims.generateFrameNumbers("wizard", { start: 9, end: 12 }),
            frameRate: 5,
        });

        this.scene.anims.create({
            key: "playerjump",
            frames: this.scene.anims.generateFrameNumbers("wizard", { start: 13, end: 14 }),
            frameRate: 5,
        });

        this.anims.play("playeridle", true);
        this.on('animationcomplete', this.animationComplete, this);
    }    
  
    update() {
        if (this.casting) return;
         if (this.cursor.down.isDown) {
            // this.body.setVelocityY(200);
            this.casting = true;
            this.anims.play("playercast", true);
          } else if (this.cursor.up.isDown && this.body.blocked.down) {
            this.body.setVelocityY(-300);
            this.anims.play("playerjump", true);
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
            this.body.setVelocityX(0);
           // if (this.body.blocked.down)
                // this.anims.play("playeridle", true);
        }
    }

    animationComplete (animation, frame) {
        if (animation.key === "playercast") {
            this.casting = false;
        }
    }
  }

export default Player;
  