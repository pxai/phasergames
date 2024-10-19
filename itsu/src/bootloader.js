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
                this.progressBar.fillStyle(0xf26419, 1);
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

       /* Array(7).fill(0).forEach((_,i) => {
            this.load.audio(`bubble${i}`,`assets/sounds/bubble/bubble${i}.mp3`)
        });*/

        this.load.image("exit", "assets/images/exit.png");
        this.load.image("brick", "assets/images/brick.png");
        this.load.image("spike", "assets/images/spike.png");
        this.load.image("pello", "assets/images/pello.png");
        // this.load.audio("beam", "assets/sounds/beam.mp3");


        this.load.spritesheet("walt", "assets/images/walt.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("bat", "assets/images/bat.png", { frameWidth: 32, frameHeight: 32 });

        Array(3)
        .fill(0)
        .forEach((_, i) => {
            this.load.tilemapTiledJSON(`scene${i}`, `assets/maps/scene${i}.json`);
        });
        this.load.image("bricks", "assets/maps/bricks.png");
        this.load.image("background", "assets/maps/background.png");

        this.load.bitmapFont("pixelFont", "assets/fonts/grapesoda.png", "assets/fonts/grapesoda.xml");

        //this.load.tilemapTiledJSON("underwater", "assets/maps/underwater.json");

        this.registry.set("seconds", 0);
        this.registry.set("coins", 0);
        this.registry.set("hull", 10);
    }

    create () {
      }

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0xf6ae2d, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
