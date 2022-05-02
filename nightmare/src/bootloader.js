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

        // CARDS
        this.load.image("ammo", "assets/images/ammo.png");
        this.load.image("health", "assets/images/health.png");
        this.load.image("armor", "assets/images/armor.png");
        this.load.image("exit", "assets/images/exit.png");
        this.load.image("gun", "assets/images/gun.png");
        this.load.image("shotgun", "assets/images/shotgun.png");
        this.load.image("minigun", "assets/images/minigun.png");
        this.load.image("rocketlauncher", "assets/images/rocketlauncher.png");
        this.load.image("bfg", "assets/images/bfg.png");
        this.load.image("chainsaw", "assets/images/chainsaw.png");

        // Foes
        this.load.image("grunt", "assets/images/grunt.png");
        this.load.image("imp", "assets/images/imp.png");
        this.load.image("shotgun_guy", "assets/images/shotgun_guy.png");
        this.load.image("minigun_guy", "assets/images/minigun_guy.png");
        this.load.image("demon", "assets/images/demon.png");
        this.load.image("cacodemon", "assets/images/cacodemon.png");
        this.load.image("knight", "assets/images/knight.png");
        this.load.image("mancubus", "assets/images/mancubus.png");
        this.load.image("cyberdemon", "assets/images/cyberdemon.png");

        this.load.image("doomguy", "assets/images/doomguy.png");

        this.load.image("pello", "assets/images/pello.png");
        this.load.image("block", "assets/images/block.png");
        this.load.image("forbidden", "assets/images/forbidden.png");
        this.load.image("pick", "assets/images/pick.png");
        sounds.forEach(sound => this.load.audio(sound, `assets/sounds/${sound}.mp3`));

        this.load.bitmapFont("doom", "assets/fonts/doom.png", "assets/fonts/doom.xml");
        this.load.bitmapFont("doomed", "assets/fonts/doomed.png", "assets/fonts/doomed.xml");
        this.load.spritesheet("cards", "assets/images/cards.png", { frameWidth: 100, frameHeight: 128 });

        // this.load.tilemapTiledJSON("underwater", "assets/maps/underwater.json");

        this.generateColors();
        this.registry.set("ammo", 0);
        this.registry.set("health", 100);
        this.registry.set("armor", 0);
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
