import Dictionary from "./dictionary";

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

        const dictionary = new Dictionary("en");
        this.load.on("complete", () => {
            this.scene.start("game", { dictionary });
        }, this);

        /* Array(7).fill(0).forEach((_,i) => {
            this.load.audio(`bubble${i}`,`assets/sounds/bubble/bubble${i}.mp3`)
        }); */

        this.load.image("fireball", "assets/images/fireball.png");
        this.load.image("pello", "assets/images/pello.png");
        this.load.image("help", "assets/images/help.png");
        this.load.spritesheet("dust", "assets/images/dust.png", { frameWidth: 32, frameHeight: 32 });

        this.load.image("letter", "assets/images/letter.png");
        this.load.image("letterbg", "assets/images/letterbg.png");
        this.load.image("letterbgbg", "assets/images/letterbgbg.png");

        this.load.audio("step", "assets/sounds/step.mp3");
        this.load.audio("fireball", "assets/sounds/fireball.mp3");
        this.load.audio("boom", "assets/sounds/boom.mp3");
        this.load.audio("death", "assets/sounds/death.mp3");
        this.load.audio("win", "assets/sounds/win.mp3");


        this.load.bitmapFont("pixelFont", "assets/fonts/mario.png", "assets/fonts/mario.xml");
        this.load.bitmapFont("castle", "assets/fonts/castle.png", "assets/fonts/castle.xml");
        this.load.bitmapFont("runeFont", "assets/fonts/runes.png", "assets/fonts/runes.xml");
        this.load.bitmapFont("celtic", "assets/fonts/celtic.png", "assets/fonts/celtic.xml");
        this.load.bitmapFont("mainFont", "assets/fonts/arcade.png", "assets/fonts/arcade.xml");
        this.load.spritesheet("raistlin", "assets/images/raistlin.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("foe", "assets/images/foe.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("skeleton", "assets/images/foe.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("arrow", "assets/images/arrow.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("bricks", "assets/images/bricks.png", { frameWidth: 32, frameHeight: 32 });

        this.load.image("map", "assets/maps/map.png");

        Array(4).fill(0).forEach((_, i) => {
            this.load.tilemapTiledJSON(`scene${i}`, `assets/maps/scene${i}.json`);
        });

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
