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
                this.progressBar.fillStyle(0x9A5000, 1);
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

        this.load.image("pello", "assets/images/pello_ok.png");
        this.load.image("up", "assets/images/up.png");
        this.load.image("down", "assets/images/down.png");
        this.load.image("fire", "assets/images/fire.png");
        this.load.image("steam", "assets/images/steam.png");
        this.load.image("fireburst", "assets/images/fireburst.png");
        //this.load.spritesheet("moriarty", "assets/images/walt.png", { frameWidth: 32, frameHeight: 32 });

        this.load.bitmapFont("moriartyFont", "assets/fonts/moriarty.png", "assets/fonts/moriarty.xml");
        this.load.spritesheet("moriarty", "assets/images/moriarty.png", { frameWidth: 64, frameHeight: 64 });

        this.load.audio("stage", "assets/sounds/stage.mp3");
        this.load.audio("steam", "assets/sounds/steam.mp3");
        this.load.audio("player", "assets/sounds/player.mp3");
        this.load.audio("music", "assets/sounds/music.mp3");
        this.load.audio("splash", "assets/sounds/splash.mp3");
        Array(4).fill(0).forEach((e, i) => { this.load.audio(`thunder${i}`, `./assets/sounds/thunder${i}.mp3`);})

        this.load.tilemapTiledJSON("scene0", "assets/maps/scene0.json");
        this.load.image("background", "assets/maps/background.png");
        this.load.image("bricks", "assets/maps/bricks.png");
        this.registry.set("score", 0);
        this.registry.set("coins", 0);
        this.registry.set("hull", 10);
    }

    create () {
      }

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0x330B0A, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
