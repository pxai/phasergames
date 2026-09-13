import { Scene } from 'phaser';

export default class Bootloader extends Scene {
    constructor() {
        super('Bootloader');
    }

    preload() {
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
            this.scene.start("Splash");
        }, this);
        this.load.setPath('assets');

        this.load.audio("music", "sounds/music.mp3");
        this.load.audio("bark", "sounds/bark.mp3");
        this.load.image('doge', 'images/doge.png');
        this.load.image('sheep', 'images/sheep.png');
        this.load.image('blackblock', 'images/blackblock.png');
        this.load.image('pello', 'images/pello.png');
        this.load.spritesheet("flag", "images/flag.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("duck", "images/duck.png", { frameWidth: 64, frameHeight: 64 });
        this.load.bitmapFont("default", "fonts/daydream.png", "fonts/daydream.xml");
        this.load.image('grasstileset', 'images/grasstileset.png');

        Array(9).fill(0).forEach((_, i) => {
            this.load.tilemapTiledJSON(`scene${i}`, `maps/scene${i}.json`)
        });

        Array(3).fill(0).forEach((_, i) => {
            this.load.audio(`duck${i}`, `sounds/duck${i}.mp3`);
        });

        Array(3).fill(0).forEach((_, i) => {
            this.load.audio(`sheep${i}`, `sounds/sheep${i}.mp3`);
        });

        this.registry.set("score", 0);
    }

    create() {

    }

    createBars() {
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
