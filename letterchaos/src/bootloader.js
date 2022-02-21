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
                this.progressBar.fillStyle(0x4d4d4d, 1);
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

        this.load.audio("bump", "assets/sounds/bump.mp3");
        this.load.audio("change", "assets/sounds/change.mp3");
        this.load.audio("fail", "assets/sounds/fail.mp3");
        this.load.audio("join", "assets/sounds/join.mp3");
        this.load.audio("resolve", "assets/sounds/resolve.mp3");
        this.load.audio("success", "assets/sounds/success.mp3");
        this.load.audio("spawn", "assets/sounds/spawn.mp3");
        this.load.audio("gameover", "assets/sounds/gameover.mp3");
        this.load.audio("intro", "assets/sounds/intro.mp3");
        this.load.audio("music", "assets/sounds/music.mp3");
        this.load.image("pello", "assets/images/pello.png");

        this.load.image("background", "assets/images/background.png");
        this.load.image("star", "assets/images/star.png");
        this.load.image("letter", "assets/images/letter.png");
        this.load.image("block0", "assets/images/block0.png");
        this.load.image("block1", "assets/images/block1.png");
        this.load.bitmapFont("pixelFont", "assets/fonts/mario.png", "assets/fonts/mario.xml");
        this.load.spritesheet("player", "assets/images/penguin.png", { frameWidth: 64, frameHeight: 64 });

        //this.load.tilemapTiledJSON("underwater", "assets/maps/underwater.json");

        this.registry.set("score", 0);
        this.registry.set("coins", 0);
        this.registry.set("hull", 10);
    }

    create () {
      }

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0xcccccc, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
