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
                this.progressBar.fillStyle(0x125555, 1);
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
        this.load.image("background1", "assets/images/background1.png");
        this.load.image("background2", "assets/images/background2.png");
        // http://www.stripegenerator.com/
        this.load.image("ground", "assets/images/platform.png");
        this.load.image("star", "assets/images/star.png");
        this.load.image("closed_door", "assets/images/closed_door.png");
        this.load.image("door", "assets/images/door.png");
        this.load.image("limit", "assets/images/limit.png");
        Array(9).fill(0).forEach((_,i) => {
            this.load.audio(`fart${i+1}`,`assets/sounds/farts/fart${i+1}.mp3`)
        });
        this.load.spritesheet("tomato", "assets/images/tomato.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("scene1", "assets/images/scene1.png", { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet("aki", "assets/images/aki.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("fart", "assets/images/fart.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("bean", "assets/images/bean.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("redbean", "assets/images/redbean.png", { frameWidth: 32, frameHeight: 32 });
        this.load.audio("music", "assets/sounds/muzik.mp3");

        this.registry.set("score", 0);
        this.registry.set("green", 0);
        this.registry.set("red", 0);
        this.load.bitmapFont("pixelFont", "assets/fonts/arcade.png", "assets/fonts/arcade.xml");
    }

    create () {
        // this.scene.start("splash")
    }

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0xffffff, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
