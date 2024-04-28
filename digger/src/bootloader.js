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
                this.progressBar.fillStyle(0xFF8700, 1);
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


        this.load.audio("music", "assets/sounds/music.mp3");

        this.load.audio("foedestroy", "assets/sounds/foedestroy.mp3");
        this.load.audio("explosion", "assets/sounds/explosion.mp3");
        this.load.audio("stageclear1", "assets/sounds/stageclear1.mp3");
        this.load.audio("stageclear2", "assets/sounds/stageclear2.mp3");
        this.load.audio("hitwall", "assets/sounds/hitwall.mp3");
        this.load.audio("hitplayer", "assets/sounds/hitplayer.mp3");
        this.load.audio("drill", "assets/sounds/drill.mp3");
        this.load.audio("stone", "assets/sounds/stone.mp3");
        this.load.audio("death", "assets/sounds/death.mp3");

        this.load.bitmapFont("pusab", "assets/fonts/pusab.png", "assets/fonts/pusab.xml");
        this.load.bitmapFont("pusab", "assets/fonts/pusab.png", "assets/fonts/pusab.xml");
        this.load.spritesheet("player", "assets/images/player.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("tnt", "assets/images/tnt.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("foe", "assets/images/foe.png", { frameWidth: 32, frameHeight: 32 });
        this.load.image('pello', 'assets/images/pello.png');
        this.load.image('brick', 'assets/maps/brick.png');
        this.load.image('bricks', 'assets/maps/bricks.png');

        this.registry.set("score", 0);
        this.registry.set("drill", 1);
        this.registry.set("speed", 100);
        this.registry.set("shield", 0);
        this.registry.set("life", 100);
    }

    create () {
      }

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0x666666, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
