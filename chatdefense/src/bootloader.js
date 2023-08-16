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
        this.loadDictionary();

        this.load.on("complete", () => {
            this.scene.start("game", { dictionary: this.dictionary, lang: this.language });
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
        this.load.spritesheet("castle", "assets/images/castle.png", { frameWidth: 256, frameHeight: 128 });


        this.load.bitmapFont("mainFont", "assets/fonts/arcade.png", "assets/fonts/arcade.xml");

        this.load.image("map", "assets/maps/map.png");

        this.load.tilemapTiledJSON(`scene0`, `assets/maps/scene0.json`);

        this.registry.set("score", 0);
        this.registry.set("coins", 0);
        this.registry.set("hull", 10);
    }


    loadDictionary () {
        const urlParams = new URLSearchParams(window.location.search);
        this.language = urlParams.get('language') || "en";
        this.dictionary = new Dictionary(this.language);
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
