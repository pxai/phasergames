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

      /*  Array(14).fill(0).forEach((_,i) => {
            this.load.image(`container${i+1}`,`assets/images/containers/${i+1}.png`)
        });*/

        this.load.image("logo", "assets/images/logo.png");
        this.load.image("pello", "assets/images/pello.png");
        this.load.image("cloud", "assets/images/cloud.png");

        this.load.audio("horn", "assets/sounds/horn.mp3");


        this.load.bitmapFont("pixelFont", "assets/fonts/mario.png", "assets/fonts/mario.xml");
        this.load.spritesheet("redfish", "assets/images/redfish.png", { frameWidth: 64, frameHeight: 32 });
        this.load.spritesheet("ufo", "assets/images/ufo.png", { frameWidth: 128, frameHeight: 64 });
        this.load.spritesheet("beam", "assets/images/beam.png", { frameWidth: 32, frameHeight: 512 });
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
