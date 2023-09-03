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
                this.progressBar.fillStyle(0x25131a, 1);
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
        },this);

       /* Array(7).fill(0).forEach((_,i) => {
            this.load.audio(`bubble${i}`,`assets/sounds/bubble/bubble${i}.mp3`)
        });*/

        //this.load.image("logo", "assets/images/logo.png");
        // this.load.audio("beam", "assets/sounds/beam.mp3");

        this.load.image("pello", "assets/images/pello_ok.png");
        this.load.bitmapFont("default", "assets/fonts/pico.png", "assets/fonts/pico.xml");
        this.load.spritesheet("player", "assets/images/player.png", { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet("dust", "assets/images/dust.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("coin", "assets/images/coin.png", { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet("keys", "assets/images/keys.png", { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet("bat", "assets/images/bat.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("wizard", "assets/images/wizard.png", { frameWidth: 48, frameHeight: 48 });

        //this.load.image("tiles", "assets/maps/buch-tileset-48px-extruded.png");
        this.load.image("fireball", "assets/images/fireball.png");
        this.load.image("tiles", "assets/maps/pixel-poem-tiles.png");
        this.load.image("block", "assets/images/block.png");
        this.load.image("seesaw", "assets/images/seesaw.png");
        this.load.image("bubble", "assets/images/bubble.png");
        this.load.image("platform", "assets/images/platform.png");
        this.load.tilemapTiledJSON("scene0", "assets/maps/level.json");

    }

    create () {
      }

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0x3d253b, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
