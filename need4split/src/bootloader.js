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
            this.scene.start("splash", {number: 0});
        },this);

        this.load.bitmapFont("demon", "assets/fonts/demon.png", "assets/fonts/demon.xml");
        this.load.bitmapFont("pico", "assets/fonts/pico.png", "assets/fonts/pico.xml");
        this.load.spritesheet("dust", "assets/images/dust.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("ball", "assets/images/ball.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("points", "assets/images/points.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("basket", "assets/images/basket.png", { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet("ghost", "assets/images/ghost.png", { frameWidth: 64, frameHeight: 32 });
        this.load.spritesheet("bat", "assets/images/bat.png", { frameWidth: 64, frameHeight: 32 });

        this.load.audio("theme", "assets/sounds/theme.mp3");
        this.load.audio("splash", "assets/sounds/splash.mp3");
        this.load.audio("gotcha", "assets/sounds/gotcha.mp3");
        this.load.audio("start", "assets/sounds/start.mp3");
        this.load.audio("boing", "assets/sounds/boing.mp3");
        this.load.audio("explosion", "assets/sounds/explosion.mp3");
        this.load.audio("win", "assets/sounds/win.mp3");
        this.load.audio("break", "assets/sounds/break.mp3");
        this.load.audio("coin", "assets/sounds/coin.mp3");

        this.load.image('pello', 'assets/images/pello.png');
        this.load.image('player', 'assets/images/player.png');

        this.load.spritesheet("coin", "assets/images/coin.png", { frameWidth: 64, frameHeight: 64 });

        this.load.image('background', 'assets/maps/background.png');
        this.load.image('tileset', 'assets/maps/tileset.png');

        this.load.image('cloud', 'assets/images/cloud.png');
        Array(8).fill(0).forEach((_,i) => {
            this.load.spritesheet(`cloud${i}`, `assets/images/cloud${i}.png`, { frameWidth: 64, frameHeight: 32 });
        });   
        Array(4).fill(0).forEach((_,i) => {
            this.load.tilemapTiledJSON(`scene${i}`, `assets/maps/scene${i}.json`);
        });  

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
