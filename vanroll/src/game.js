import Player from "./player";
import Tile from "./tile";
const OFFSET = 16;
const STEP = 32;

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
  }

    preload () {
    }

    create () {
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      this.stageClear = false;

      this.loadAudios();
      // this.playMusic();
      this.addMap();
      this.addPlayer();
      this.addControls();
      //this.addTitle();
      this.addMovesText();
    }

    addControls () {
      this.cursor = this.input.keyboard.createCursorKeys();
      this.R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
      this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    addMap() {
      this.powerUps = this.add.group()
      this.canvasTiles = this.add.group()
      this.foes = this.add.group()
      // Cover the 800x800 grid with 2px sized black tiles
      const size = 4;
      for (let x = 0; x < this.width; x += size) {
        for (let y = 0; y < this.height; y += size) {
          this.canvasTiles.add(new Tile(this, x, y, 0xffffff, size))
        }
      }
    }

    addPlayer () {

      this.player = new Player(this, this.center_width, this.center_height, "player1");

      this.physics.add.overlap(
        this.player,
        this.canvasTiles,
        this.hitTile,
        () => {
          return true;
        },
        this
      );

      this.physics.add.overlap(
        this.player,
        this.powerUps,
        this.hitPowerUp,
        () => {
          return true;
        },
        this
      );

      this.physics.add.overlap(
        this.player,
        this.foes,
        this.hitFoe,
        () => {
          return true;
        },
        this
      );
    }

    hitTile(player, tile) {
      //return
      this.add.rectangle(tile.x, tile.y, 4, 4, 0x00ff00).setOrigin(0).setAlpha(0.5)
      tile.destroy();
    }

    hitPowerUp(player, powerUp) {
    }

    hitFoe(player, foe) {
      foe.destroy();
      this.finishScene()
    }


    addTitle() {
      this.car1 = this.add.sprite(this.center_width + 256, 140, "player2").setOrigin(1, 0).setRotation(Math.PI/2).setScale(2)
      this.car1Position = {x: this.car1.x, y: this.car1.y};
      this.car2 = this.add.sprite(this.center_width - 256, 140, "player1").setOrigin(0, 0).setRotation(-Math.PI/2).setScale(2)
      this.car2Position = {x: this.car2.x, y: this.car2.y};
      this.titleText1 = this.add.bitmapText(this.center_width, 64, "pixelFont", "OT", 80).setOrigin(1,0).setTint(0x4A9130)
      this.titleText2 = this.add.bitmapText(this.center_width, 64, "pixelFont", "TO", 80).setOrigin(0, 0).setTint(0xA13647)
    }

    addMovesText () {
      this.movesText = this.add.bitmapText(this.center_width, 164, "pixelFont", this.registry.get("moves"), 40).setOrigin(0.5)
    }

    loadAudios () {
      this.engine = this.sound.add("engine")
      this.audios = {
        "win": this.sound.add("win"),
        "move": this.sound.add("move"),
        "engine": this.sound.add("engine"),
      };
    }

    playAudio(key, volume=.3) {
      this.audios[key].play({volume});
    }

    update() {

    }


    playEngine(rate = 0.5, volume = 0.5) {
      if (!this.engine.isPlaying) {
        this.engine.play({
          rate: Phaser.Math.Between(8, 12)/10,
          volume: Phaser.Math.Between(1, 5)/10
        });
      }
    }

    finishScene () {
      this.playAudio("win")
      this.showWin()
     // this.theme.stop();
     this.time.delayedCall(2000, ()=> {this.scene.start("transition", {number: this.number + 1});}, null, this)

    }

    showWin() {
      this.winText1 = this.add.bitmapText(this.center_width, - 100, "pixelFont", "Stage", 120).setOrigin(0.5).setTint(0x4A9130).setDropShadow(2, 2, 0xA13647, 0.7);
      this.winText2 = this.add.bitmapText(this.center_width,  1000, "pixelFont", "Cleared", 120).setOrigin(0.5).setTint(0xA13647).setDropShadow(2, 2, 0x4A9130, 0.7);
    }

    restartScene () {
      //this.theme.stop();
      this.scene.start("transition", {number: this.number});
    }
}
