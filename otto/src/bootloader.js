export default class Bootloader extends Phaser.Scene {
    constructor () {
        super({ key: "bootloader" });
    }

    preload () {
        this.createBars();
        this.load.on(
            "progress",
            function (value) {
                this.progressBar.clear();
                this.progressBar.fillStyle(0xDEA551, 1);
                this.progressBar.fillRect(
                    this.cameras.main.width / 4,
                    this.cameras.main.height / 2 - 16,
                    (this.cameras.main.width / 2) * value,
                    16
                );
            },
            this
        );
        this.load.on("complete", () => {
            this.scene.start("splash", {number: 0});
        },this);


        this.load.image("player1", "assets/images/player1.png");
        this.load.image("trophy1", "assets/images/trophy1.png");
        this.load.image("player2", "assets/images/player2.png");
        this.load.image("trophy2", "assets/images/trophy2.png");
        this.load.image("star", "assets/images/star.png");

       /* Array(7).fill(0).forEach((_,i) => {
            this.load.audio(`bubble${i}`,`assets/sounds/bubble/bubble${i}.mp3`)
        });*/

        this.load.image("pello", "assets/images/pello.png");
        this.load.audio("splash", "assets/sounds/splash.mp3");
        this.load.audio("music", "assets/sounds/music.mp3");


        this.load.audio("win", "assets/sounds/win.mp3");
        this.load.audio("move", "assets/sounds/move.mp3");
        this.load.audio("engine", "assets/sounds/engine.mp3");


        this.load.bitmapFont("pixelFont", "assets/fonts/mario.png", "assets/fonts/mario.xml");
        this.load.spritesheet("dust", "assets/images/dust.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("trail", "assets/images/trail.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("trail2", "assets/images/trail2.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("exit", "assets/images/exit.png", { frameWidth: 32, frameHeight: 32 });

        this.load.image('otto', 'assets/maps/otto.png');

        Array(8).fill(0).forEach((_,i) => {
            this.load.tilemapTiledJSON(`scene${i}`, `assets/maps/scene${i}.json`);
        });

        this.registry.set("moves", 0);
    }

    create () {
      }

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0x518ADE, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
