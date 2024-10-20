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
                this.progressBar.fillStyle(0x494d7e, 1);
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

        Array(9).fill(0).forEach((_,i) => {
            this.load.image(`marble${i+1}`,`assets/images/marbles/marble${i+1}.png`)
        });

        Array(14).fill(0).forEach((_,i) => {
            this.load.image(`container${i+1}`,`assets/images/containers/${i+1}.png`)
        });

        this.load.image("ship", "assets/images/ship.png");
        this.load.image("planet", "assets/images/planet.png");
        this.load.image("asteroid", "assets/images/asteroid.png");
        this.load.image("container", "assets/images/container.png");
        this.load.image("logo", "assets/images/logo.png");
        this.load.image("pello", "assets/images/pello.png");
        this.load.image("bump", "assets/images/bump.png");
        this.load.audio("music", "assets/sounds/muzik.mp3");
        this.load.audio("horn", "assets/sounds/horn.mp3");
        this.load.audio("lock", "assets/sounds/lock.mp3");
        this.load.audio("thrust", "assets/sounds/thrust.mp3");
        this.load.audio("marble", "assets/sounds/marble.mp3");
        this.load.audio("shot", "assets/sounds/shot.mp3");
        Array(4).fill(0).forEach((_,i) => {
            this.load.audio(`hit${i+1}`,`assets/sounds/hit${i+1}.mp3`)
        });

        Array(7).fill(0).forEach((_,i) => {
            this.load.audio(`meow${i+1}`,`assets/sounds/meow/meow${i+1}.mp3`)
        });
        this.load.bitmapFont("pixelFont", "assets/fonts/arcade.png", "assets/fonts/arcade.xml");

        this.load.spritesheet("lock", "assets/images/lock.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("shot", "assets/images/shot.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("thrust", "assets/images/thrust.png", { frameWidth: 32, frameHeight: 32 });

        this.registry.set("score", 0);
        this.registry.set("containers", 0);
        this.registry.set("hull", 100);
    }

    create () {
      }

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0xfff6d6, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
