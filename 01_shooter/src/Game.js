class Game extends Phaser.Scene {
  constructor() {
      super("gameScene");
  }
  preload(){
    this.load.image("starfield", "assets/images/starfield.png");
    this.load.image("ship1", "assets/images/galaga.png");
    this.load.image("foe", "assets/images/foe.png");
    this.load.image("laser", "assets/images/laser.png");

    this.load.spritesheet("laser", "assets/images/laser.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.spritesheet("explosion", "assets/images/explosion.png", {
      frameWidth: 64,
      frameHeight: 64
    });
    this.load.bitmapFont("pixelFont", "assets/fonts/font.png", "assets/fonts/font.xml");
    this.load.audio("boom", "assets/sounds/boom.mp3");
    this.load.audio("shot", "assets/sounds/shot.mp3");
    this.load.audio("music", "assets/sounds/music.mp3");

  }

  create () {
    this.add.text(80, 80, "Game started");
  this.background = this.add.tileSprite(0, 0, config.width, config.height, "starfield");
    this.background.setOrigin(0, 0);
    this.anims.create({key: "laser_anim", frames: this.anims.generateFrameNumbers("laser"), frameRate: 20, repeat: -1});
    this.ship = this.physics.add.image(150, 250, "ship1");
    this.cursor = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.anims.create({
      key: "explode",
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true
    });
    this.bullets = this.add.group();
    this.foes = this.add.group();
    this.physics.add.collider(this.bullets, this.foes, this.hitFoe.bind(this));

    this.physics.add.collider(this.ship, this.foes, this.hitShip);
    this.addScore();
    this.sound.play("music");
  }

addScore () {
    // 2.1 add a score property
    this.score = 0;

    // 1.3 new text using bitmap font
    //this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE ", 16);

    // 4.3 format the score
    this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", "SCORE " + this.score, 16);
}
  update() {
    this.background.tilePositionX += 1;
    this.updateShip();
    //this.updateBullets();
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)){
        this.shoot();
    }
    const chances = Phaser.Math.Between(0, 1);
      if (chances === 1){
        this.addFoe();
    }
  }

  updateBullets () {
    this.projectiles.getChildren().forEach( laser => laser.update());
  }

  shoot () {
    const laser = new Laser(this);
    this.sound.play("shot");
  }

  addFoe () {
    const foe = new Foe(this, config);
  }

  hitFoe(ship, foe) {
    const explosion = new Explosion(this, foe.x, foe.y);
    foe.destroy();
    ship.destroy();
    this.sound.play("boom");
    this.score = this.score + 1;
    this.scoreLabel.text = "SCORE " + this.score;
  }

  updateShip () {
    this.ship.setVelocityX(0);
    this.ship.setVelocityY(0);
    if (this.cursor.left.isDown) {
      this.ship.setVelocityX(-100);
    } else if (this.cursor.right.isDown) {
      this.ship.setVelocityX(100);
    }

    if (this.cursor.up.isDown) {
      this.ship.setVelocityY(-100);
    } else if (this.cursor.down.isDown) {
      this.ship.setVelocityY(100);
    }
  }
}
