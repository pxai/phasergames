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

        Array(15).fill(0).forEach((_,i) => {
            this.load.image(`cloud${i}`,`assets/images/cloud${i}.png`)
        });

        this.load.image("pello", "assets/images/pello.png");
        this.load.image("sensei", "assets/images/sensei.png");

        this.load.audio("win", "assets/sounds/win.mp3");
        this.load.audio("drip", "assets/sounds/drip.mp3");
        this.load.audio("fail", "assets/sounds/fail.mp3");
        this.load.bitmapFont("mainFont2", "assets/fonts/nerko.png", "assets/fonts/nerko.xml");
        this.load.bitmapFont("mainFont", "assets/fonts/romanus.png", "assets/fonts/romanus.xml");


        this.registry.set("score", 0);
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
