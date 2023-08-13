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
            this.scene.start("game", { next: "game", name: "STAGE", number: 0, time: 30 });
        }, this);

        this.load.image("pello", "assets/images/pello.png");
        this.load.image("logo", "assets/images/logo.png");
        this.load.spritesheet("human", "assets/images/human.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("zombie", "assets/images/zombie.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("chopper", "assets/images/chopper.png", { frameWidth: 128, frameHeight: 128 });

        //this.load.audio("step", "assets/sounds/step.mp3");

        this.load.bitmapFont("mainFont", "assets/fonts/arcade.png", "assets/fonts/arcade.xml");
        this.load.bitmapFont("creep", "assets/fonts/creep.png", "assets/fonts/creep.xml");
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
