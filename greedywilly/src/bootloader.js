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
                this.progressBar.fillStyle(0xe5cc18, 1);
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

        Array(4).fill(0).forEach((_,i) => {
            this.load.audio(`music${i}`,`assets/sounds/music${i}.mp3`)
        });

        this.load.bitmapFont("pico", "assets/fonts/pico.png", "assets/fonts/pico.xml");
        this.load.bitmapFont("western", "assets/fonts/western.png", "assets/fonts/western.xml");
        this.load.spritesheet("walt", "assets/images/walt.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("tnt", "assets/images/tnt.png", { frameWidth: 32, frameHeight: 32 });

        this.load.audio("splash", "assets/sounds/splash.mp3");

        this.load.audio("stone", "assets/sounds/stone.mp3");

        this.load.image("cave", "assets/maps/cave.png");
        this.load.image("heart", "assets/images/heart.png");
        this.load.image("pello", "assets/images/pello_ok.png");
        this.load.image("exit", "assets/images/exit.png");
        this.load.spritesheet("chest", "assets/images/chest.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("gold", "assets/images/gold.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('rock', 'assets/maps/cave.png', { frameWidth: 32, frameHeight: 32 });
        this.registry.set("score", 0);
        this.registry.set("tnt", 1);
        this.registry.set("health", 10);
    }

    create () {
      }

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0xb85d08, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
