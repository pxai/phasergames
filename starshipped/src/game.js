import Phaser from "phaser";
import Player from "./player";

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
    }

    preload () {
        this.registry.set("score", 0);
        this.registry.set("health", 100);
        this.registry.set("time", 0);
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.player = new Player(this, 40, 40)
        this.cameras.main.setBackgroundColor(0x494d7e);
       // this.loadAudios();
       // this.playMusic();
    }

    update () {
        this.player.update();
    }

    playMusic () {
        if (this.theme) this.theme.stop()
        this.theme = this.sound.add("muzik", {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });
        this.theme.play()
    }

    loadAudios () {
        this.audios = {
          // "move": this.sound.add("move"),
        };
      }

    playAudio(key) {
        this.audios[key].play();
    }
}
