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
                this.progressBar.fillStyle(0x88d24c, 1);
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

        Array(7).fill(0).forEach((_,i) => {
            this.load.audio(`music${i}`,`assets/sounds/music${i}.mp3`)
        });

        this.load.audio("win", "assets/sounds/win.mp3");
        this.load.audio("gameover", "assets/sounds/gameover.mp3");
        this.load.image("pello", "assets/images/pello.png");
        this.load.image("logo", "assets/images/logo.png");
        this.load.audio("appear", "assets/sounds/appear.mp3");
        this.load.audio("boom", "assets/sounds/boom.mp3");
        this.load.audio("ground", "assets/sounds/ground.mp3");
        this.load.audio("hit", "assets/sounds/hit.mp3");
        this.load.audio("jump", "assets/sounds/jump.mp3");
        this.load.audio("pick", "assets/sounds/pick.mp3");
        Array(6).fill(0).forEach((_,i) => {
            this.load.image(`d${i+1}`,`assets/images/d${i+1}.png`)
        });

        this.load.image('heart', 'assets/images/heart.png');
        this.load.bitmapFont("wizardFont", "assets/fonts/wizard.png", "assets/fonts/wizard.xml");
        this.load.spritesheet("wizard", "assets/images/wizard.png", { frameWidth: 32, frameHeight: 64 });
        this.load.spritesheet("bat", "assets/images/bat.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("drop", "assets/images/drop.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("snake", "assets/images/snake.png", { frameWidth: 64, frameHeight: 32 });
        this.load.image('riseup_tileset_fg', 'assets/maps/riseup_tileset_fg.png');
        this.load.image('riseup_tileset_bg', 'assets/maps/riseup_tileset_bg.png');
        // this.load.image('weezard_tileset_fg', 'assets/maps/weezard_tileset_fg.png');

        Array(7).fill(0).forEach((_,i) => {
            this.load.tilemapTiledJSON(`scene${i}`, `assets/maps/scene${i}.json`);
        });
     


        this.registry.set("score", 0);
        this.registry.set("coins", 0);
        this.registry.set("health", 10);
        this.registry.set("room", 0);
    }

    create () {
      }

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0x008483, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
