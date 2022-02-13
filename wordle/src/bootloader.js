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
            this.scene.start("splash");
        },this);

       /* Array(7).fill(0).forEach((_,i) => {
            this.load.audio(`bubble${i}`,`assets/sounds/bubble/bubble${i}.mp3`)
        });*/

        //this.load.image("logo", "assets/images/logo.png");
        this.load.image("letter", "assets/images/letter.png");
        this.load.audio("match", "assets/sounds/match.mp3");
        this.load.audio("almost", "assets/sounds/almost.mp3");
        this.load.audio("key", "assets/sounds/key.mp3");
        this.load.audio("fail", "assets/sounds/fail.mp3");
        this.load.audio("over", "assets/sounds/over.mp3");

        this.load.audio("victory", "assets/sounds/victory.mp3");
        this.load.audio("defeat", "assets/sounds/defeat.mp3");
        this.load.audio("splash", "assets/sounds/splash.mp3");
        this.load.bitmapFont("font2", "assets/fonts/font2.png", "assets/fonts/font2.xml");
        this.load.bitmapFont("pixelFont", "assets/fonts/mario.png", "assets/fonts/mario.xml");
        this.load.spritesheet("keycup", "assets/images/keycup.png", { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet("penguin", "assets/images/penguin.png", { frameWidth: 64, frameHeight: 64 });
        this.load.image("block0", "assets/images/block0.png");
        this.load.image("block1", "assets/images/block1.png");
        this.load.image("background", "assets/images/background.png");
        //this.load.tilemapTiledJSON("underwater", "assets/maps/underwater.json");

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
