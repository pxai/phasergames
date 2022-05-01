import sounds from "./sounds";

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
            this.scene.start("splash");
        }, this);

        /* Array(7).fill(0).forEach((_,i) => {
            this.load.audio(`bubble${i}`,`assets/sounds/bubble/bubble${i}.mp3`)
        }); */

        this.load.image("pello", "assets/images/pello.png");
        this.load.image("forbidden", "assets/images/forbidden.png");
        this.load.image("pick", "assets/images/pick.png");
        sounds.forEach(sound => this.load.audio(sound, `assets/sounds/${sound}.mp3`));

        this.load.bitmapFont("doom", "assets/fonts/doom.png", "assets/fonts/doom.xml");
        this.load.bitmapFont("doomed", "assets/fonts/doomed.png", "assets/fonts/doomed.xml");
        this.load.spritesheet("cards", "assets/images/cards.png", { frameWidth: 100, frameHeight: 128 });

        // this.load.tilemapTiledJSON("underwater", "assets/maps/underwater.json");

        this.generateColors();
        this.registry.set("score", 0);
        this.registry.set("coins", 0);
        this.registry.set("hull", 10);
    }

    create () {
    }

    generateColors () {
        const primary = Phaser.Math.Between(0x010101, 0xfefefe);
        this.registry.set("primaryColor", primary);
        this.registry.set("secondaryColor", 0xffffff ^ primary); //~primary
        this.registry.set("tertiaryColor", 0x000000);
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
