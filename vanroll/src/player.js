class Player extends Phaser.GameObjects.Container {
    constructor (scene, x, y, health = 10) {
        super(scene, x, y)
        this.scene = scene;


        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.body.setAllowGravity(false);
        this.body.setSize(32, 8)

        this.plow = this.scene.add.rectangle(
            0,
            0,
            32,
            8,
            0xf22c2e
        ).setOrigin(0)
        this.add(this.plow )
        this.van = new Phaser.GameObjects.Sprite(this.scene, 0, 0, "player1").setOrigin(0)
        this.add(this.van)
        this.dead = false;
        this.speed_x = 0;// This is the speed it's currently moving at
        this.speed_y = 0;
        this.angle = 0;
        this.speed = 0; // This is the parameter for how fast it should move
        this.upDelta = 0
        this.friction = .95;
        this.setControls()
        this.init();
    }


    setControls() {
      this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.scene.input.on('pointerdown', (pointer) => this.movePlayer(pointer), this);
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
      this.body.setVelocity(0, -200);
      this.setControls()
  }


    update () {
        if (this.dead) return;

        if (this.x < 0 || this.x > 800 || this.y < 0 || this.y > 800) {
            this.body.setVelocity(-this.body.velocity.x, -this.body.velocity.y)
            this.dead = true
            this.scene.time.delayedCall(300, () => { this.dead = false}, null, this)
        }

    }


    movePlayer(pointer) {
        // Calculate the direction of the line
        let dx = this.x - pointer.upX;
        let dy = this.y - pointer.upY;

        // Normalize the direction
        let length = Math.sqrt((dx * dx) + (dy * dy));
        dx /= length;
        dy /= length;

        let speed = 200;
        this.body.setVelocity(dx * speed, dy * speed);
      }

    turn () {
        this.right = !this.right;
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
