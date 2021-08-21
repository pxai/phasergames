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
            this.scene.start("intro");
        },this);
        this.load.image("background1", "assets/images/background1.png");
        this.load.image("background2", "assets/images/background2.png");
        // http://www.stripegenerator.com/
        this.load.image("pello", "assets/images/pello.png");
        this.load.image("logo", "assets/images/logo.png");

        this.load.image("closed_door", "assets/images/closed_door.png");
        this.load.image("door", "assets/images/door.png");
        this.load.image("limit", "assets/images/limit.png");
        this.load.image("bullet", "assets/images/bullet.png");
        this.load.image("single-bean", "assets/images/single-bean.png");
        this.load.image("single-redbean", "assets/images/single-redbean.png");
        Array(9).fill(0).forEach((_,i) => {
            this.load.audio(`fart${i+1}`,`assets/sounds/farts/fart${i+1}.mp3`)
        });

        this.load.audio("albatdeath","assets/sounds/albatdeath.mp3");
        this.load.audio("carrot1","assets/sounds/carrot1.mp3");
        this.load.audio("carrot2","assets/sounds/carrot2.mp3");
        this.load.audio("fall","assets/sounds/fall.mp3");
        this.load.audio("farthit","assets/sounds/farthit.mp3");
        this.load.audio("greenbean","assets/sounds/greenbean.mp3");
        this.load.audio("kill","assets/sounds/kill.mp3");
        this.load.audio("playerplatform","assets/sounds/playerplatform.mp3");
        this.load.audio("playerreturn","assets/sounds/playerreturn.mp3");
        this.load.audio("redbean","assets/sounds/redbean.mp3");
        this.load.audio("playerdeath","assets/sounds/playerdeath.mp3");
        this.load.audio("marble","assets/sounds/marble.mp3");

        Array(4).fill(0).forEach((_,i) => {
            this.load.image(`platform${i+1}`,`assets/images/platform${i+1}.png`)
        });

        Array(9).fill(0).forEach((_,i) => {
            this.load.image(`marble${i+1}`,`assets/images/marbles/marble${i+1}.png`)
        });
        this.load.spritesheet("tomato", "assets/images/tomato.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("greenpepper", "assets/images/greenpepper.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("avocado", "assets/images/avocado.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("carrot", "assets/images/carrot.png", { frameWidth: 32, frameHeight: 32 });

        this.load.spritesheet("scene1", "assets/images/scene1.png", { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet("aki", "assets/images/aki.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("fart", "assets/images/fart.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("bean", "assets/images/bean.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("redbean", "assets/images/redbean.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("albat", "assets/images/albat.png", { frameWidth: 32, frameHeight: 32 });
        this.load.audio("music", "assets/sounds/muzik.mp3");
        this.load.bitmapFont("pixelFont", "assets/fonts/arcade.png", "assets/fonts/arcade.xml");

        this.registry.set("score", 0);
        this.registry.set("green", 0);
        this.registry.set("red", 0);
    }

    create () {
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
