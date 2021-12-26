
import { Scene3D } from '@enable3d/phaser-extension'

export default class Bootloader extends Scene3D {
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
            this.scene.start("game");
        },this);

        Array(4).fill(0).forEach((e, i) => { this.load.audio(`thunder${i}`, `./assets/sounds/thunder${i}.mp3`);})
        Array(2).fill(0).forEach((e, i) => { this.load.audio(`passby${i}`, `./assets/sounds/passby${i}.mp3`);})
        //this.load.image("logo", "assets/images/logo.png");
        // this.load.audio("beam", "assets/sounds/beam.mp3");


        this.load.bitmapFont("pixelFont", "assets/fonts/mario.png", "assets/fonts/mario.xml");
        // this.load.spritesheet("chopper", "assets/images/chopper.png", { frameWidth: 128, frameHeight: 128 });


        //this.load.tilemapTiledJSON("underwater", "assets/maps/underwater.json");

        this.registry.set("deviation", "0")
        this.registry.set("probes", "20")
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
