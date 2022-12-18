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
                this.progressBar.fillStyle(0xb95e00, 1);
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
            this.scene.start("splash");
        },this);

       /* Array(7).fill(0).forEach((_,i) => {
            this.load.audio(`bubble${i}`,`assets/sounds/bubble/bubble${i}.mp3`)
        });*/

        this.load.image("pello", "assets/images/pello.png");
        // this.load.audio("beam", "assets/sounds/beam.mp3");
        this.load.spritesheet("spider", "assets/images/spider.png", { frameWidth: 32, frameHeight: 32 });

        this.load.bitmapFont("mario", "assets/fonts/mario.png", "assets/fonts/mario.xml");
        this.load.audio("music", "assets/sounds/music.mp3");
        this.load.audio("splash", "assets/sounds/splash.mp3");

        this.load.audio("win", "assets/sounds/win.mp3");
        this.load.audio("hover", "assets/sounds/hover.mp3");
        this.load.audio("select", "assets/sounds/select.mp3");
        this.load.audio("bump", "assets/sounds/bump.mp3");
        this.load.audio("move", "assets/sounds/move.mp3");

        this.load.image('background', 'assets/images/background.png');
        this.load.image('tileset_fg', 'assets/maps/tileset_fg.png');
        this.load.image('bolt', 'assets/images/bolt.png');
        this.load.image('block_green', 'assets/images/block_green.png');
        this.load.image('block_blue', 'assets/images/block_blue.png');
        this.load.image('block_yellow', 'assets/images/block_yellow.png');
        this.load.image('star', 'assets/images/star.png');
        this.load.spritesheet("bulb", "assets/images/bulb.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("energy", "assets/images/energy.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("block", "assets/images/block.png", { frameWidth: 48, frameHeight: 48 });

        [1, 3, 5, 7].forEach(i => {
            this.load.image(`switch${i}`,`assets/images/switch${i}.png`)
        });


        Array(9).fill(0).forEach((_,i) => {
            this.load.tilemapTiledJSON(`scene${i}`, `assets/maps/scene${i}.json`);
        });

        this.registry.set("score", 0);
        this.registry.set("moves", 0);
    }

    create () {
      }

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0xfffd00, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
