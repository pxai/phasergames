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
        this.load.spritesheet("willie", "assets/images/willie.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("tnt", "assets/images/tnt.png", { frameWidth: 32, frameHeight: 32 });

        this.load.audio("splash", "assets/sounds/splash.mp3");

        this.load.audio("stone", "assets/sounds/stone.mp3");
        this.load.audio("explosion", "assets/sounds/explosion.mp3");
        this.load.audio("wick", "assets/sounds/wick.mp3");
        this.load.audio("land", "assets/sounds/land.mp3");
        this.load.audio("jump", "assets/sounds/jump.mp3");
        this.load.audio("hit", "assets/sounds/hit.mp3");
        this.load.audio("yee-haw", "assets/sounds/yee-haw.mp3");
        this.load.audio("chest0", "assets/sounds/chest0.mp3");
        this.load.audio("chest1", "assets/sounds/chest1.mp3");
        this.load.audio("gold", "assets/sounds/gold.mp3");
        this.load.audio("coin", "assets/sounds/coin.mp3");
        this.load.audio("start", "assets/sounds/start.mp3");
        this.load.audio("exit", "assets/sounds/exit.mp3");
        this.load.audio("step", "assets/sounds/step.mp3");
        this.load.audio("outro", "assets/sounds/outro.mp3");
        this.load.image("cave", "assets/maps/cave.png");
        this.load.image("heart", "assets/images/heart.png");
        this.load.image("boots", "assets/images/boots.png");
        this.load.image("pello", "assets/images/pello_ok.png");
        this.load.image("exit", "assets/images/exit.png");
        this.load.image("remote", "assets/images/remote.png");
        this.load.image("whisky", "assets/images/whisky.png");
        this.load.spritesheet("chest", "assets/images/chest.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("gold", "assets/images/gold.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("explosion", "assets/images/explosion.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('rock', 'assets/maps/cave.png', { frameWidth: 32, frameHeight: 32 });
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
