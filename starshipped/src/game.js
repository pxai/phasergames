import Phaser from "phaser";
import Player from "./player";
import Background from "./background";
import Items from "./items";

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
        this.shots = this.add.group();
        this.addBackground();
        this.addItems();
        this.player = new Player(this, 40, 40)
        // this.cameras.main.setBackgroundColor(0x494d7e);

       // this.loadAudios();
       // this.playMusic();
    }

    addBackground () {
        this.backgroundLayer = this.add.layer();
        this.background = new Background(this)
    }

    addItems () {
        this.asteroids = this.add.group()
        this.boxes = this.add.group();
        this.items = new Items(this)
    }

    update () {
        this.player.update();
        this.shots.children.entries.forEach(shot => { 
            if(shot.x < -10 || shot.x > 1000 || shot.y < -10 || shot.y > 1000){
                this.shots.remove(shot);
                shot.destroy;
            } else {
                shot.update();
            }
        });
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
