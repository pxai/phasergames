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
                this.progressBar.fillStyle(0x88d24c, 1);
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
            this.scene.start("game", { next: "game", name: "STAGE", number: 0, time: 30 });
        }, this);

        /* Array(7).fill(0).forEach((_,i) => {
            this.load.audio(`bubble${i}`,`assets/sounds/bubble/bubble${i}.mp3`)
        }); */

        this.load.image("pello", "assets/images/pello.png");
        this.load.image("help", "assets/images/help.png");
        this.load.spritesheet("shield", "assets/images/shield.png", { frameWidth: 64, frameHeight: 64 });
        this.load.image("table", "assets/images/table.png");

        this.load.audio("theme", "assets/sounds/theme.mp3");
        this.load.audio("splash", "assets/sounds/splash.mp3");
        this.load.audio("gotcha", "assets/sounds/gotcha.mp3");
        this.load.audio("start", "assets/sounds/start.mp3");
        this.load.audio("boing", "assets/sounds/boing.mp3");
        this.load.audio("marble", "assets/sounds/marble.mp3");
        this.load.audio("win", "assets/sounds/win.mp3");
        this.load.audio("break", "assets/sounds/break.mp3");
        this.load.audio("quack", "assets/sounds/quack.mp3");


        this.load.bitmapFont("pixelFont", "assets/fonts/mario.png", "assets/fonts/mario.xml");
        this.load.bitmapFont("castle", "assets/fonts/castle.png", "assets/fonts/castle.xml");
        this.load.bitmapFont("mainFont", "assets/fonts/ostrich.png", "assets/fonts/ostrich.xml");
        this.load.bitmapFont("arcade", "assets/fonts/arcade.png", "assets/fonts/arcade.xml");
        this.load.spritesheet("foe", "assets/images/foe.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("dust", "assets/images/dust.png", { frameWidth: 32, frameHeight: 32 });


        this.load.spritesheet("bat", "assets/images/bat.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("ball", "assets/images/ball.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("basket", "assets/images/basket.png", { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet("gasol", "assets/images/gasol.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("quack", "assets/images/quack.png", { frameWidth: 64, frameHeight: 64 });


        this.registry.set("score", 0);
        this.registry.set("coins", 0);
        this.registry.set("hull", 10);
    }

    create () {
    }

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0x008483, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
