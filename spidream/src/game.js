import Player from "./player";
import Scenario from "./scenario";
import APP from "./music";
import * as Tone from 'tone'

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
      this.cameras.main.setBackgroundColor(0x000000)
      console.log("Amos")
      this.addPointer();
      this.addPlayer();
      this.addMusic();
      new Scenario(this)
      //this.loadAudios(); 
      // this.playMusic();
    }

    addPlayer() {
      this.player = new Player(this, 200, 200)
    }

    addPointer() {
      this.pointer = this.input.activePointer;
      this.input.mouse.disableContextMenu();
    }

    addMusic () {
      if (Tone.context.state !== 'running') Tone.context.resume();
      APP.MusicGenerator.init(((Math.random() * 100000000) + (Math.random() * 10000)).toString());
      APP.MusicGenerator.play()
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
