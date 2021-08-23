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

        Array(9).fill(0).forEach((_,i) => {
            this.load.image(`marble${i+1}`,`assets/images/marbles/marble${i+1}.png`)
        });

        Array(8).fill(0).forEach((_,i) => {
            this.load.image(`container${i+1}`,`assets/images/containers/${i+1}.png`)
        });

        /*this.load.image("single-redbean", "assets/images/single-redbean.png");
        this.load.audio("playerdeath","assets/sounds/playerdeath.mp3");
        this.load.spritesheet("tomato", "assets/images/tomato.png", { frameWidth: 32, frameHeight: 32 });
 */
        this.load.image("ship", "assets/images/ship.png");
        this.load.image("asteroid", "assets/images/asteroid.png");
        this.load.image("container", "assets/images/container.png");
        this.load.audio("music", "assets/sounds/muzik.mp3");
        this.load.bitmapFont("pixelFont", "assets/fonts/arcade.png", "assets/fonts/arcade.xml");

        this.registry.set("score", 0);
        this.registry.set("containers", 0);
        this.registry.set("hull", 100);
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
