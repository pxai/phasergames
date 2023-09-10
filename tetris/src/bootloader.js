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
        }, this);

        /* Array(7).fill(0).forEach((_,i) => {
            this.load.audio(`bubble${i}`,`assets/sounds/bubble/bubble${i}.mp3`)
        }); */

        // this.load.image("logo", "assets/images/logo.png");
        this.load.audio("clear", "assets/sounds/clear.mp3");
        this.load.audio("rotate", "assets/sounds/rotate.mp3");
        this.load.audio("move", "assets/sounds/move.mp3");
        this.load.audio("gameOver", "assets/sounds/gameOver.mp3");
        this.load.audio("appear", "assets/sounds/appear.mp3");
        this.load.audio("push", "assets/sounds/push.mp3");
        this.load.audio("land", "assets/sounds/land.mp3");

        this.load.image("green", "assets/images/green.png");
        this.load.image("blue", "assets/images/blue.png");
        this.load.image("red", "assets/images/red.png");
        this.load.image("yellow", "assets/images/yellow.png");
        this.load.image("grey", "assets/images/grey.png");
        this.load.image("purple", "assets/images/purple.png");
        this.load.image("orange", "assets/images/orange.png");
        this.load.image("black", "assets/images/black.png");
        this.load.bitmapFont("pixelFont", "assets/fonts/mario.png", "assets/fonts/mario.xml");

        // this.load.tilemapTiledJSON("underwater", "assets/maps/underwater.json");

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
