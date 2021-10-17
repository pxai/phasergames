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
        this.load.image("torpedo", "assets/images/torpedo.png");
        this.load.image("bubble", "assets/images/bubble.png");
        this.load.image("heart", "assets/images/heart.png");
        this.load.audio("beam", "assets/sounds/beam.mp3");
        this.load.audio("coinfall", "assets/sounds/coinfall.mp3");
        this.load.audio("coin", "assets/sounds/coin.mp3");
        this.load.audio("coinshot", "assets/sounds/coinshot.mp3");
        this.load.audio("death", "assets/sounds/death.mp3");
        this.load.audio("fish", "assets/sounds/fish.mp3");
        this.load.audio("foedeath", "assets/sounds/foedeath.mp3");
        this.load.audio("hit", "assets/sounds/hit.mp3");
        this.load.audio("screen", "assets/sounds/screen.mp3");
        this.load.audio("torpedo", "assets/sounds/torpedo.mp3");
        this.load.audio("transition", "assets/sounds/transition.mp3");

        this.load.audio("splash", "assets/sounds/splash.mp3");
        this.load.audio("game", "assets/sounds/game.mp3");
        this.load.audio("underwater", "assets/sounds/underwater.mp3");
        this.load.audio("depth", "assets/sounds/depth.mp3");
        this.load.audio("escape", "assets/sounds/escape.mp3");
        this.load.audio("outro", "assets/sounds/outro.mp3");

        this.load.bitmapFont("pixelFont", "assets/fonts/mario.png", "assets/fonts/mario.xml");
        this.load.spritesheet("chopper", "assets/images/chopper.png", { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet("redfish", "assets/images/redfish.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("ufo", "assets/images/ufo.png", { frameWidth: 128, frameHeight: 64 });
        this.load.spritesheet("ufowater", "assets/images/ufowater.png", { frameWidth: 128, frameHeight: 64 });
        this.load.spritesheet("beam", "assets/images/beam.png", { frameWidth: 32, frameHeight: 512 });
        this.load.spritesheet("missile", "assets/images/missile.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("death", "assets/images/death.png", { frameWidth: 128, frameHeight: 64 });
        this.load.spritesheet('coin', './assets/images/coin.png',{ frameWidth: 32, frameHeight: 32 })
        this.load.spritesheet('submarine', './assets/images/submarine.png',{ frameWidth: 128, frameHeight: 64 })
        this.load.image('block', 'assets/maps/block.png');
        this.load.image('background', 'assets/maps/background.png');
        this.load.tilemapTiledJSON("underwater", "assets/maps/underwater.json");
        this.load.tilemapTiledJSON("depth", "assets/maps/depth.json");
        this.load.tilemapTiledJSON("escape", "assets/maps/escape.json");

        this.registry.set("score", 0);
        this.registry.set("coins", 0);
        this.registry.set("hull", 10);
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
