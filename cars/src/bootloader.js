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
            this.scene.start("game");
        },this);

       /* Array(7).fill(0).forEach((_,i) => {
            this.load.audio(`bubble${i}`,`assets/sounds/bubble/bubble${i}.mp3`)
        });*/

        //this.load.image("logo", "assets/images/logo.png");
        this.load.audio("explosion", "assets/sounds/explosion.mp3");

        this.load.audio("music", "assets/sounds/music.mp3");
        this.load.bitmapFont("pico", "assets/fonts/pico.png", "assets/fonts/pico.xml");
        this.load.bitmapFont("pixelFont", "assets/fonts/mario.png", "assets/fonts/mario.xml");
        this.load.spritesheet("player", "assets/images/player.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("scenario64", "assets/images/scenario64.png", { frameWidth: 64, frameHeight: 64 });
        this.load.image("road", "assets/images/road.png");
        this.load.image("obstacle", "assets/images/obstacle.png");
        this.load.image("box", "assets/images/box.png");
        this.load.image("bullet", "assets/images/bullet.png");
        this.load.spritesheet("tree", "assets/images/tree.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("explosion", "assets/images/explosion.png", { frameWidth: 64, frameHeight: 64 });

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
