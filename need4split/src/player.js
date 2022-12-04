class Player {
    constructor (scene, x, y, gravity = false) {
      this.scene = scene;
      this.partA = this.scene.add.sprite(x, y, "player")

      this.scene.add.existing(this.partA); 
      this.scene.physics.add.existing(this.partA);
      this.partA.body.collideWorldBounds = true;
      this.partA.body.setSize(24, 24)
      this.partA.body.setAllowGravity(gravity);

      this.partB = this.scene.add.sprite(x, y, "player")
      this.scene.add.existing(this.partB);
      this.scene.physics.add.existing(this.partB);
      this.partB.body.collideWorldBounds = true;
      this.partB.body.setSize(24, 24)
      this.partB.body.setAllowGravity(gravity);

      //this.init();
      this.distance = 0;
      this.invincible = false;
      this.health = 10;
      this.addControls();
      this.scene.events.on("update", this.update, this);
      this.velocity = 4;
      this.partA.body.setVelocityX(200);
      this.partB.body.setVelocityX(200);
      this.partA.body.setDragY(1000)
      this.partB.body.setDragY(1000)
      this.splits = 0;
    }

    init () {
        this.scene.anims.create({
            key: "walk",
            frames: this.scene.anims.generateFrameNumbers("player", { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.anims.create({
            key: "jump",
            frames: this.scene.anims.generateFrameNumbers("player", { start:1, end: 1 }),
            frameRate: 5,
        });

        this.anims.play("walk", true);
    }    

    addControls() {
      this.cursor = this.scene.input.keyboard.createCursorKeys();
      this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  update () {
    if (this.dead) return;

    if (this.W.isDown || this.cursor.up.isDown) {

      this.partA.body.setVelocityY(-200)
      this.partB.body.setVelocityY(-200)
      //this.partA.body.y -= this.velocity;
      //this.partB.body.y -= this.velocity;
    } else if (this.S.isDown || this.cursor.down.isDown) {

      this.partA.body.setVelocityY(200)
      this.partB.body.setVelocityY(200)
      //this.partA.body.y += this.velocity;
      //this.partB.body.y += this.velocity;
    }



    if ((Phaser.Input.Keyboard.JustDown(this.D) || Phaser.Input.Keyboard.JustDown(this.cursor.right))) {
        this.splits++;
        console.log("Distance appart!!: ", this.splits)
        this.distance += 42;
        this.partA.body.y -= 42;
        this.partB.body.y += 42;
    }  else if (this.splits > 0 && (Phaser.Input.Keyboard.JustDown(this.A)|| Phaser.Input.Keyboard.JustDown(this.cursor.left)))  {
        if (this.splits > 0) this.splits--;
        console.log("Come back: ", this.splits)
        this.distance -= 42;
        this.partA.body.y += 42;
        this.partB.body.y -= 42;
        if (this.splits === 0) {
          this.partB.body.x = this.partA.body.x;
          this.partB.body.y = this.partA.body.y;
        }
    }
    if (this.partA.body)
      this.partA.body.setVelocityX(200);
    if (this.partB.body)
      this.partB.body.setVelocityX(200);
  }

  destroy() {
    this.dead = true;
    this.partA.destroy();
    this.partB.destroy();
  }
  
  }

export default Player;
  