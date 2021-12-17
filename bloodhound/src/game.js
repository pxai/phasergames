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
      this.cursor = this.input.keyboard.createCursorKeys();
      this.aim = new Aim(this, this.center_width, this.center_height)
      this.hunter = new Hunter(this, this.center_width, this.center_height)
      //this.loadAudios(); 
      // this.playMusic();
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

    update() {
      if (this.cursor.left.isDown) {
        this.aim.x -= 3;
        this.hunter.x -= 3
      } 

      if (this.cursor.right.isDown) {
        this.aim.x += 3;
        this.hunter.x += 3
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

    this.init();
  }

  init () {
    this.body.setCollideWorldBounds(true);
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