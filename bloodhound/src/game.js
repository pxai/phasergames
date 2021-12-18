export default class Game extends Phaser.Scene {
  constructor () {
      super({ key: "game" });
      this.player = null;
      this.score = 0;
      this.scoreText = null;
  }

  init (data) {
    this.name = data.name;
    this.number = data.number;
    this.time = data.time;
}

  preload () {
  }

  create () {
    console.log("Created GAME!")
    this.duration = this.time * 1000;
    this.width = this.sys.game.config.width;
    this.height = this.sys.game.config.height;
    this.center_width = this.width / 2;
    this.center_height = this.height / 2;
    this.setBackground();

    this.cursor = this.input.keyboard.createCursorKeys();
    this.Z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.shoot = 0;
    this.shootSpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.aim = new Aim(this, this.center_width, this.center_height)
    this.hunter = new Hunter(this, this.center_width, this.center_height)

    //this.loadAudios(); 
    // this.playMusic();
  }

  setBackground () {
    this.image = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'stage1')
    let scaleX = this.cameras.main.width / this.image.width
    let scaleY = this.cameras.main.height / this.image.height
    let scale = Math.max(scaleX, scaleY)
    this.image.setScale(scale).setScrollFactor(0)
  }

  loadAudios () {
    this.audios = {
      "beam": this.sound.add("beam"),
    };
  }

  playAudio(key) {
    this.audios[key].play();
  }

  playMusic (theme="game") {
    this.theme = this.sound.add(theme);
    this.theme.stop();
    this.theme.play({
      mute: false,
      volume: 1,
      rate: 1,
      detune: 0,
      seek: 0,
      loop: true,
      delay: 0
    })
  }

  update(delta, time) {
    this.shoot += time; 
    
    if (this.Z.isDown) {
      console.log("FIRE!!", delta, this.shoot);
      this.hunter.anims.play("shoot", true);
      new Shot(this, this.aim.x, this.aim.y)
      this.shoot = 0;
    } 

    if (this.cursor.left.isDown) {
      this.aim.x -= 3;
      this.hunter.flipX = false;
      if (this.shoot > 200) {
        this.hunter.anims.play("walk", true);
        this.hunter.x -= 3
      }
    } 

    if (this.cursor.right.isDown) {
      this.aim.x += 3;
      this.hunter.flipX = true;
      if (this.shoot > 200) {
        this.hunter.anims.play("walk", true);
        this.hunter.x += 3
      } 
    }

    if (!this.cursor.left.isDown && !this.cursor.right.isDown && this.shoot > 200 ) {
      this.hunter.anims.play("idle", true);
    }
  
    if (this.cursor.up.isDown) {
      this.aim.y -= 3;
    } 

    if (this.cursor.down.isDown) {  
      this.aim.y += 3;
    }
  }

  finishScene () {
    this.sky.stop();
    this.theme.stop();
    this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1, time: this.time * 2});
  }

  updateScore (points = 0) {
      const score = +this.registry.get("score") + points;
      this.registry.set("score", score);
      this.scoreText.setText(Number(score).toLocaleString());
  }
}

class Hunter extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "hunter")
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.scene.physics.world.enable(this);
    this.body.setAllowGravity(true);
    this.right = true;
    this.init();
  }

  init () {
    this.body.setCollideWorldBounds(true);
    this.scene.anims.create({
      key: "idle",
      frames: this.scene.anims.generateFrameNumbers("hunter", { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1
    });

    this.scene.anims.create({
      key: "walk",
      frames: this.scene.anims.generateFrameNumbers("hunter", { start: 2, end: 4 }),
      frameRate: 3,
      repeat: -1
    });

    this.scene.anims.create({
      key: "shoot",
      frames: this.scene.anims.generateFrameNumbers("hunter", { start: 5, end: 6 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.play("idle", true);
    // this.on("animationupdate" , this.castInTime, this);
    // this.on('animationcomplete', this.animationComplete, this);

    this.flipX = this.right;
  }
}

class Aim extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "aim")
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.scene.physics.world.enable(this);
    this.body.setAllowGravity(false);

    this.init();
  }

  init () {
    this.body.setCollideWorldBounds(true);
  }
} 

class Shot extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y, w = 32, h = 32, color = 0xffffff) {
    super(scene, x, y, w, h, color)
    this.setAlpha(0.0)
    this.scene = scene;
    this.color = color;
    this.width = w;
    this.height = h;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.scene.physics.world.enable(this);
    this.body.setAllowGravity(false);

    this.init();
  }

  init () {
    this.scene.tweens.add({
      targets: this.scene.aim,
      duration: 100,
      alpha: {from: 0.3, to: 1},
      repeat: 3,
      onComplete: () => {
        this.destroy()
      }
    })  
  }
} 