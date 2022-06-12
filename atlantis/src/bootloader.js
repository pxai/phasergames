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
            this.scene.start("game");
        },this);

       /* Array(7).fill(0).forEach((_,i) => {
            this.load.audio(`bubble${i}`,`assets/sounds/bubble/bubble${i}.mp3`)
        });*/

        //this.load.image("logo", "assets/images/logo.png");
        // this.load.audio("beam", "assets/sounds/beam.mp3");

        this.load.image("fireball", "assets/images/fireball.png");
        this.load.image("bubble", "assets/images/bubble.png");
        this.load.spritesheet("bat", "assets/images/bat.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("coin", "assets/images/coin.png", { frameWidth: 64, frameHeight: 64 });
        
        this.load.bitmapFont("pixelFont", "assets/fonts/mario.png", "assets/fonts/mario.xml");
        this.load.spritesheet("willie", "assets/images/willie.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("water", "assets/images/water.png", { frameWidth: 64, frameHeight: 64 });

        this.load.image('tileset_fg', 'assets/maps/tileset_fg.png');

        Array(1).fill(0).forEach((_,i) => {
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
