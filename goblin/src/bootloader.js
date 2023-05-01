export default class Bootloader extends Phaser.Scene {
    constructor () {
        super({ key: "bootloader" });
        console.log("let start this shit")
    }

    preload () {
        this.createBars();
        this.load.on(
            "progress",
            function (value) {
                this.progressBar.clear();
                this.progressBar.fillStyle(0x1c6c00, 1);
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

        this.load.image("pello", "assets/images/pello.png");
        this.load.image("spike", "assets/images/spike.png");
        this.load.image("exit", "assets/images/exit.png");
        this.load.image("question", "assets/images/question.png");
        this.load.image("conveyor", "assets/images/conveyor.png");
        this.load.image("gear", "assets/images/gear.png");
        this.load.image("muffin", "assets/images/muffin.png");
        this.load.image("muffintop", "assets/images/muffintop.png");

        this.load.spritesheet("dust", "assets/images/dust.png", { frameWidth: 32, frameHeight: 32 });
        
        this.load.audio("key", "assets/sounds/key.mp3");
        this.load.audio("death", "assets/sounds/death.mp3");
        this.load.audio("jump", "assets/sounds/jump.mp3");
        this.load.audio("coin", "assets/sounds/coin.mp3");
        this.load.audio("kill", "assets/sounds/kill.mp3");
        this.load.audio("land", "assets/sounds/land.mp3");
        this.load.audio("lunchbox", "assets/sounds/lunchbox.mp3");
        this.load.audio("prize", "assets/sounds/prize.mp3");
        this.load.audio("created", "assets/sounds/created.mp3");
        this.load.audio("muffin", "assets/sounds/muffin.mp3");
        this.load.audio("destroy", "assets/sounds/destroy.mp3");
        this.load.audio("stage", "assets/sounds/stage.mp3");
        this.load.audio("transition", "assets/sounds/transition.mp3");
        this.load.audio("splash", "assets/sounds/splash.mp3");

        Array(2).fill(0).forEach((_,i) => {
            this.load.image(`brick${i}`,`assets/images/brick${i}.png`)
        });
        this.load.spritesheet("bat", "assets/images/bat.png", { frameWidth: 32, frameHeight: 32 });

        this.load.spritesheet("walt", "assets/images/walt.png", { frameWidth: 64, frameHeight: 64 });

        this.load.tilemapTiledJSON(`scene0`, `assets/maps/scene0.json`);
        this.load.image('softbricks', 'assets/maps/softbricks.png');
        this.load.image('bricks', 'assets/maps/bricks.png');
        this.load.image('background', 'assets/maps/background.png');

        this.load.image('chain', 'assets/images/chain.png');

        this.load.bitmapFont("celtic", "assets/fonts/celtic.png", "assets/fonts/celtic.xml");
        this.registry.set("time", 0);
        this.registry.set("currentMinScore", 0);
    }

    create () {
      }

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0xf09937, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
