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
            //this.scene.start("splash");
            this.scene.start("game",{ playerClass: "elf"})
        },this);

        this.load.spritesheet('elf', 'assets/images/elf.png', { frameWidth: 16, frameHeight: 28});
        this.load.spritesheet('wizard', 'assets/images/wizard.png', { frameWidth: 16, frameHeight: 28});
        this.load.spritesheet('knight', 'assets/images/knight.png', { frameWidth: 16, frameHeight: 28});
        this.load.spritesheet('chest', 'assets/images/chest.png', { frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('skeleton', 'assets/images/skeleton.png', { frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('wogol', 'assets/images/wogol.png', { frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('minizombie', 'assets/images/minizombie.png', { frameWidth: 16, frameHeight: 16});

       /* Array(7).fill(0).forEach((_,i) => {
            this.load.audio(`bubble${i}`,`assets/sounds/bubble/bubble${i}.mp3`)
        });*/

        //this.load.image("logo", "assets/images/logo.png");
        // this.load.audio("beam", "assets/sounds/beam.mp3");


        this.load.bitmapFont("pixelFont", "assets/fonts/cute.png", "assets/fonts/cute.xml");
       // this.load.spritesheet("chopper", "assets/images/chopper.png", { frameWidth: 128, frameHeight: 128 });


        //this.load.tilemapTiledJSON("underwater", "assets/maps/underwater.json");

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
