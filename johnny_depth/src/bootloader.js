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
            this.scene.start("game", { name: "tutorial", number: 0 });
        },this);

       /* Array(7).fill(0).forEach((_,i) => {
            this.load.audio(`bubble${i}`,`assets/sounds/bubble/bubble${i}.mp3`)
        });*/

        //this.load.image("logo", "assets/images/logo.png");
        // this.load.audio("beam", "assets/sounds/beam.mp3");


        this.load.bitmapFont("pixelFont", "assets/fonts/mario.png", "assets/fonts/mario.xml");
        this.load.spritesheet("johnny", "assets/images/johnny.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("fireball", "assets/images/fireball.png",  { frameWidth: 32, frameHeight: 32 });
        this.load.image("shot", "assets/images/shot.png");
        this.load.image('bubble', 'assets/images/bubble.png');
        this.load.image('volcano', 'assets/images/volcano.png');
        this.load.image('water_volcano', 'assets/images/water_volcano.png');
        this.load.image('mine', 'assets/images/mine.png');
        this.load.spritesheet("ember", "assets/images/ember.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("fish", "assets/images/fish.png", { frameWidth: 32, frameHeight: 32 });
        this.load.image('cave', 'assets/maps/cave.png');
        Array(1).fill(0).forEach((_,i) => {
            this.load.tilemapTiledJSON(`scene${i}`, `assets/maps/scene${i}.json`);
        });

        this.registry.set("score", 0);
        this.registry.set("embers", 0);
        this.registry.set("health", 10);
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
