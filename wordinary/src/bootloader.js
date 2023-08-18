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

        Array(15).fill(0).forEach((_,i) => {
            this.load.image(`cloud${i}`,`assets/images/cloud${i}.png`)
        });

        this.load.image("pello", "assets/images/pello.png");
        this.load.image("letter", "assets/images/letter.png");
        this.load.image("letterbg", "assets/images/letterbg.png");
        this.load.image("letterbgbg", "assets/images/letterbgbg.png");
        this.load.image("arrow", "assets/images/arrow.png");

        this.load.audio("win", "assets/sounds/win.mp3");
        this.load.audio("drip", "assets/sounds/drip.mp3");
        this.load.audio("fail", "assets/sounds/fail.mp3");
        this.load.bitmapFont("mainFont", "assets/fonts/baloo.png", "assets/fonts/baloo.xml");


        this.registry.set("score", 0);
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
