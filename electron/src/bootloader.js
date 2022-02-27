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

        Array(5).fill(0).forEach((_,i) => {
            this.load.image(`particle${i}`,`assets/images/particle${i}.png`)
        });

        //this.load.image("logo", "assets/images/logo.png");
        // this.load.audio("beam", "assets/sounds/beam.mp3");
        this.load.audio("spawn", "assets/sounds/spawn.mp3");
        this.load.audio("atract", "assets/sounds/atract.mp3");
        this.load.audio("repel", "assets/sounds/repel.mp3");
        this.load.audio("click", "assets/sounds/click.mp3");
        this.load.audio("powerup", "assets/sounds/powerup.mp3");
        this.load.audio("move", "assets/sounds/move.mp3");
        this.load.audio("death", "assets/sounds/death.mp3");
        this.load.audio("hit", "assets/sounds/hit.mp3");
        this.load.audio("bump", "assets/sounds/bump.mp3");
        this.load.audio("coin", "assets/sounds/coin.mp3");
        this.load.audio("coinboom", "assets/sounds/coinboom.mp3");
        this.load.audio("music", "assets/sounds/music.mp3");

        this.load.image("background", "assets/images/background.png");
        this.load.image("stage1", "assets/images/stage1.png");
        this.load.image("pello", "assets/images/pello.png");
        this.load.image("evil", "assets/images/evil.png");
        this.load.image("good", "assets/images/good.png");
        this.load.bitmapFont("visitor", "assets/fonts/visitor.png", "assets/fonts/visitor.xml");
        this.load.spritesheet("electron", "assets/images/electron.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("coin", "assets/images/coin.png", { frameWidth: 32, frameHeight: 32 });

        //this.load.tilemapTiledJSON("underwater", "assets/maps/underwater.json");

        this.registry.set("score", 0);
        this.registry.set("life", 100);
        this.registry.set("coins", 0);
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
