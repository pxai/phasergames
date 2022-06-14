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
                this.progressBar.fillStyle(0x472e26, 1);
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

        Array(4).fill(0).forEach((_,i) => {
            this.load.image(`block${i}`, `assets/images/block${i}.png`);
        });
        this.load.image("firing_block", "assets/images/firing_block.png");
        this.load.image("pello", "assets/images/pello_ok.png");
        this.load.audio("coin", "assets/sounds/coin.mp3");
        this.load.audio("exit", "assets/sounds/exit.mp3");
        this.load.audio("gold", "assets/sounds/gold.mp3");
        this.load.audio("hit", "assets/sounds/hit.mp3");
        this.load.audio("jump", "assets/sounds/jump.mp3");
        this.load.audio("land", "assets/sounds/land.mp3");
        this.load.audio("step", "assets/sounds/step.mp3");
        this.load.audio("stone", "assets/sounds/stone.mp3");
        this.load.audio("boom", "assets/sounds/boom.mp3");
        this.load.audio("bump1", "assets/sounds/bump1.mp3");
        this.load.audio("bump2", "assets/sounds/bump2.mp3");
        this.load.audio("death", "assets/sounds/death.mp3");
        this.load.audio("door", "assets/sounds/door.mp3");
        this.load.audio("foeshot", "assets/sounds/foeshot.mp3");
        this.load.audio("bubble", "assets/sounds/bubble.mp3");
        this.load.audio("crack", "assets/sounds/crack.mp3");

        this.load.audio("splash", "assets/sounds/splash.mp3");
        this.load.audio("outro", "assets/sounds/outro.mp3");
        this.load.audio("game", "assets/sounds/game.mp3");

        this.load.image("logo", "assets/images/logo.png");
        this.load.image("background", "assets/images/background.png");
        this.load.image("fireball", "assets/images/fireball.png");
        this.load.image("bubble", "assets/images/bubble.png");
        this.load.image("burst", "assets/images/burst.png");
        this.load.spritesheet("bat", "assets/images/bat.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("coin", "assets/images/coin.png", { frameWidth: 64, frameHeight: 64 });
        
        this.load.bitmapFont("pixelFont", "assets/fonts/mario.png", "assets/fonts/mario.xml");
        this.load.spritesheet("indy", "assets/images/indy.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("water", "assets/images/water.png", { frameWidth: 64, frameHeight: 64 });

        this.load.image('tileset_fg', 'assets/maps/tileset_fg.png');

        Array(6).fill(0).forEach((_,i) => {
            this.load.tilemapTiledJSON(`scene${i}`, `assets/maps/scene${i}.json`);
        });
        this.registry.set("score", 0);
        this.registry.set("coins", 0);
        this.registry.set("number", 0);
    }

    create () {
      }

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0xa18c4d, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
