import Key from "./key";
import Wordle from "./wordle";

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
      //this.cameras.main.setBackgroundColor(0x003300);
      this.wordle = new Wordle("opera")

      this.addLetters();

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

    }

    addLetters () {
      const alphabet = "qwertyuiop-asdfghjklñ-zxcvbnm";
      this.keyboard = {};
      let stepY = 0;
      let stepX = 0;
      let x = 0;
      let y = 0;

      alphabet.split("").forEach((letter, i) => {
        const isDash = letter === "-";
        x = stepX ;
        stepY += isDash ? 51 : 0 
        stepX = isDash ? 0 : stepX + 48;
        y = 550 + stepY;

        if (isDash) return;

        const key = new Key(this, x, y, letter)
        this.keyboard[letter] = key;
      })

      this.keyboard["ok"] = new Key(this, x + 48, y, "ok");
      this.keyboard["-"] = new Key(this, x + 96, y, "-");
    }

    finishScene () {
      this.sky.stop();
      this.theme.stop();
      this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1});
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }

    clickedLetter (letter) {
      console.log("Letter! ", letter)
    }
}
