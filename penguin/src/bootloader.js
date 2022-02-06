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
                this.progressBar.fillStyle(0x3e6875, 1);
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

        this.load.image("pellologo", "assets/images/pellologo.png");
        this.load.audio("flap", "assets/sounds/flap.mp3");
        this.load.audio("chirp", "assets/sounds/chirp.mp3");
        this.load.audio("hitice", "assets/sounds/hitice.mp3");
        this.load.audio("water", "assets/sounds/water.mp3");
        this.load.audio("blizzard", "assets/sounds/blizzard.mp3");
        this.load.audio("rescue", "assets/sounds/rescue.mp3");
        this.load.audio("thankyou", "assets/sounds/thankyou.mp3");
        this.load.audio("music", "assets/sounds/music.mp3");

        this.load.bitmapFont("pixelFont", "assets/fonts/mario.png", "assets/fonts/mario.xml");

        this.load.spritesheet('flake', 'assets/images/flake.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("penguin", "./assets/images/penguin.png", { frameWidth: 64, frameHeight: 64 });
        Array(1).fill(0).forEach((_,i) => {
            this.load.image(`ice${i}`, `assets/images/ice${i}.png`);
        });


        this.load.spritesheet("little", "assets/images/little.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("water", "assets/images/water.png", { frameWidth: 64, frameHeight: 64 });
        Array(2).fill(0).forEach((_,i) => {
            this.load.image(`block${i}`, `assets/images/block${i}.png`);
        });

        this.load.image("star", "assets/images/star.png");
        this.load.image("logo", "assets/images/logo.png");

        this.registry.set("score", 0);
        this.registry.set("coins", 0);
        this.registry.set("hull", 10);
    }

    create () {
      }

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0x64a7bd, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
