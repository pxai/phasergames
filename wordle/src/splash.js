import Key from "./key";
import Step from "./step";
import Wordle from "./wordle";
import Penguin from "./penguin";

export default class Splash extends Phaser.Scene {
    constructor () {
        super({ key: "splash" });
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
      this.add.tileSprite(0, 0, 1800, 1800, "background").setOrigin(0.5);
      this.cameras.main.setBackgroundColor(0xffffff);
      this.wordle = new Wordle("opera")
      this.guess = "";
      this.enabled = true;
      
      this.addTitle();
      this.addStartButton();
      this.addWalls();
      this.addPenguin();
      this.loadAudios(); 
      this.playAudio("splash")
      // this.playMusic();
    }

    addTitle() {
      this.add.bitmapText(this.center_width, this.center_height, "pixelFont", "WORDLE", 50).setOrigin(0.5).setDropShadow(3, 4, 0x222222, 0.7);
      this.add.bitmapText(this.center_width, this.center_height + 600, "pixelFont", "By PELLO", 20).setOrigin(0.5);
    }

    addStartButton () {
      this.startButton = this.add.bitmapText(this.center_width, this.center_height + 150, "pixelFont", "START", 40).setOrigin(0.5).setDropShadow(3, 4, 0x222222, 0.7);
      this.startButton.setInteractive();
      this.startButton.on('pointerdown', () => {
        this.finishScene();
      });

      this.startButton.on('pointerover', () => {
        this.startButton.setTint(0x3E6875)
      });

      this.startButton.on('pointerout', () => {
        this.startButton.setTint(0xffffff)
      });
    }

    addWalls() {
      for (let i = 0; i < 16; i++) {
        this.add.sprite(30, i * 64, "block" + Phaser.Math.Between(0, 1));
        this.add.sprite(468, i * 64, "block" + Phaser.Math.Between(0, 1));
      }
    }
      loadAudios () {
        this.audios = {
          "splash": this.sound.add("splash"),
          "match": this.sound.add("match"),
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
    }

    addPenguin () {
      this.penguin = new Penguin(this, this.center_width, this.center_height + 100)
    }

    finishScene () {
      this.playAudio("match")
      this.scene.start("game", {next: "underwater", name: "STAGE", number: this.number + 1});
    }
}
