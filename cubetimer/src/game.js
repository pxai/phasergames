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
      

      this.loadAudios(); 
      this.input.keyboard.on("keydown-SPACE", () => {
        this.done12 = false;
        this.finished = false;
        this.seconds = 0;
        this.timer();
        this.flow(8000, "8")
    }, this);

      this.addSeconds();
      // this.playMusic();
    }

    timer () {
      this.time.delayedCall(1000, () => {
        this.seconds++;
        this.secondsText.setText(this.seconds)
        this.timer();
      }, null, this)
    }

    addSeconds () {
      this.seconds = 0;
      this.secondsText = this.add.bitmapText(this.center_width, this.center_height, "pixelFont", "0", 40)
    }

    flow (time, audio, end = false) {
      this.time.delayedCall(time, () => {
        this.playAudio("8");
        this.flow1(4000, "12")
      }, null, this)
    }

    flow1(time, audio,) {
      this.time.delayedCall(time, () => {
        this.playAudio(audio);
        this.flow2(3000, "gold")
      }, null, this)
    }

    flow2(time, audio) {
      this.time.delayedCall(time, () => {
        this.playAudio("gold");
      }, null, this)
    }

      loadAudios () {
        this.audios = {
          "8": this.sound.add("8"),
          "gold": this.sound.add("gold"),
          "12": this.sound.add("12"),
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
}
