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
                this.progressBar.fillStyle(0xf09937, 1);
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

        //this.load.image("logo", "assets/images/logo.png");
        // this.load.audio("beam", "assets/sounds/beam.mp3");


        Array(2).fill(0).forEach((_,i) => {
            this.load.image(`brick${i}`,`assets/images/brick${i}.png`)
        });

        Array(5).fill(0).forEach((_,i) => {
            this.load.image(`platform${i+2}`,`assets/images/platform${i+2}.png`)
        });

        this.load.bitmapFont("pixelFont", "assets/fonts/mario.png", "assets/fonts/mario.xml");
        this.load.spritesheet("walt", "assets/images/walt.png", { frameWidth: 64, frameHeight: 64 });

        Array(4).fill(0).forEach((_,i) => {
            this.load.tilemapTiledJSON(`scene${i}`, `assets/maps/scene${i}.json`);
        });
        this.load.image('softbricks', 'assets/maps/softbricks.png');
        this.load.image('bricks', 'assets/maps/bricks.png');
        this.load.image('background', 'assets/maps/background.png');

        this.load.spritesheet("bat", "assets/images/bat.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("snake", "assets/images/snake.png", { frameWidth: 64, frameHeight: 32 });
        this.load.spritesheet("coin", "assets/images/coin.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("lunchbox", "assets/images/lunchbox.png", { frameWidth: 64, frameHeight: 64 });

        this.registry.set("score", 0);
        this.registry.set("coins", 0);
        this.registry.set("hull", 10);
    }

    create () {
      }

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0xca6702, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
