import Phaser from "phaser";
import Player from "./player";
import Background from "./background";
import Items from "./items";
import Explosion from "./explosion";

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
        this.checkWorld = false;

        this.addBackground();
        this.addPlayer()
        this.addItems();


        // this.cameras.main.setBackgroundColor(0x494d7e);

       // this.loadAudios();
       // this.playMusic();
       this.cameras.main.startFollow(this.player, true);
    }

    addPlayer() {
        this.thrust = this.add.layer();
        this.player = new Player(this, this.center_width, this.center_height)
        this.time.delayedCall(300, () => { this.checkWorld = true; });
    }

    addBackground () {
        this.backgroundLayer = this.add.layer();
        this.background = new Background(this)
    }

    addItems () {
        this.asteroids = this.add.group()
        this.boxes = this.add.group();
        this.items = new Items(this)

        this.physics.add.overlap(this.player, this.asteroids, this.crashAsteroid.bind(this));
        this.physics.add.overlap(this.shots, this.asteroids, this.destroyAsteroid.bind(this));
        this.physics.add.overlap(this.shots, this.ship, this.shotShip.bind(this));
    }

    shotShip(shot, ship) {
        console.log("SHIP SHOT!", shot.id, ship.id)
        if (shot.id === ship.id) return;
        console.log("DOWN SHIP SHOT!", shot.id, ship.id)
        shot.destroy();
        ship.destroy()
    }

    destroyAsteroid(shot, asteroid) {
        shot.destroy();
        new Explosion(this, asteroid.x, asteroid.y, "0xcccccc", 15)
        asteroid.destroy();
    }

    crashAsteroid (player, asteroid) {
        new Explosion(this, asteroid.x, asteroid.y, "0xcccccc", 15)
        asteroid.destroy();
        this.destroyPlayer()
    }

    destroyPlayer () {
        new Explosion(this, this.player.x, this.player.y, "0xffffff", 10)
        this.player.destroy();

        this.time.delayedCall(2000, () => this.startGame());
    }

    update () {
        if (!this.player.death) { 
            this.player.update();
            this.checkPlayerInside();
        }
        this.shots.children.entries.forEach(shot => { 
            if(shot.x < -10 || shot.x > 1000 || shot.y < -10 || shot.y > 1000){
                this.shots.remove(shot);
                shot.destroy;
            } else {
                shot.update();
            }
        });
    }

    checkPlayerInside () {
        if (!this.checkWorld) return;

        const worldView = this.cameras.main.worldView;
        if (!worldView.contains(this.player.x, this.player.y)) { this.destroyPlayer(); }
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

    startGame () {
        if (this.theme) this.theme.stop();
        this.scene.start("game");
    }
}
