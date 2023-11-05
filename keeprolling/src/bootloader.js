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
                this.progressBar.fillStyle(0x618fc0, 1);
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

        this.load.image("pello", "assets/images/pello.png");
        this.load.audio("blip", "assets/sounds/blip.mp3");
        this.load.audio("step", "assets/sounds/step.mp3");
        this.load.audio("fail", "assets/sounds/fail.mp3");
        this.load.audio("win", "assets/sounds/win.mp3");
        this.load.audio("music", "assets/sounds/music.mp3");


        this.load.bitmapFont("default", "assets/fonts/mage.png", "assets/fonts/mage.xml");
        this.load.bitmapFont("pixelFont", "assets/fonts/mario.png", "assets/fonts/mario.xml");
        this.load.bitmapFont("wendy", "assets/fonts/wendy.png", "assets/fonts/wendy.xml");
        this.load.spritesheet("die", "assets/images/die.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("dust", "assets/images/dust.png", { frameWidth: 32, frameHeight: 32 });

        Array(9).fill(0).forEach((_,i) => {
            this.load.tilemapTiledJSON(`scene${i}`, `assets/maps/scene${i}.json`);
        });


        this.registry.set("steps", 0);
        this.registry.set("points", 0);
    }

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0x232268, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
