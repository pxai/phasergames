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

       /* Array(7).fill(0).forEach((_,i) => {
            this.load.audio(`bubble${i}`,`assets/sounds/bubble/bubble${i}.mp3`)
        });*/


        this.load.audio("music", "assets/sounds/music.mp3");
        this.load.audio("start", "assets/sounds/start.mp3");
        this.load.audio("engine", "assets/sounds/engine.mp3");

        this.load.audio("foedestroy", "assets/sounds/foedestroy.mp3");
        this.load.audio("foeshot", "assets/sounds/foeshot.mp3");
        this.load.audio("explosion", "assets/sounds/explosion.mp3");
        this.load.audio("stageclear1", "assets/sounds/stageclear1.mp3");
        this.load.audio("stageclear2", "assets/sounds/stageclear2.mp3");
        this.load.audio("hitwall", "assets/sounds/hitwall.mp3");
        this.load.audio("hitplayer", "assets/sounds/hitplayer.mp3");
        this.load.audio("drill", "assets/sounds/drill.mp3");
        this.load.audio("stone", "assets/sounds/stone.mp3");
        this.load.audio("yee-haw", "assets/sounds/yee-haw.mp3");

        this.load.bitmapFont("pusab", "assets/fonts/pusab.png", "assets/fonts/pusab.xml");
        this.load.bitmapFont("pusab", "assets/fonts/pusab.png", "assets/fonts/pusab.xml");
        this.load.spritesheet("player", "assets/images/player.png", { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet("gold", "assets/images/gold.png", { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet("silver", "assets/images/silver.png", { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet("ruby", "assets/images/ruby.png", { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet("oil", "assets/images/oil.png", { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet("foe0", "assets/images/foe0.png", { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet("bat", "assets/images/bat.png", { frameWidth: 32, frameHeight: 32 });
        this.load.image('pello', 'assets/images/pello.png');
        this.load.image('logo1', 'assets/images/logo1.png');
        this.load.image('logo2', 'assets/images/logo2.png');
        this.load.image('shield', 'assets/images/shield.png');
        this.load.image('drill', 'assets/images/drill.png');
        this.load.image('lightning', 'assets/images/lightning.png');

        Array(4).fill(0).forEach((_,i) => {
            this.load.tilemapTiledJSON(`dungeon${i}`, `assets/maps/dungeon${i}.json`);
        });
        this.load.image('brick', 'assets/maps/brick.png');
        //this.load.image('background', 'assets/maps/background.png');

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
