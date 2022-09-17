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
                this.progressBar.fillStyle(0x204631, 1);
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
        this.load.image("star", "assets/images/star.png");
        this.load.image("fireball", "assets/images/fireball.png");
        this.load.image("wizardshot", "assets/images/wizardshot.png");
        this.load.image("key", "assets/images/key.png");
        this.load.image("shaken", "assets/images/shaken.png");
        this.load.image("shogun", "assets/images/shogun.png");

        this.load.audio("cast", "assets/sounds/cast.mp3");
        this.load.audio("emptymana", "assets/sounds/emptymana.mp3");
        this.load.audio("fireball", "assets/sounds/fireball.mp3");
        this.load.audio("boom", "assets/sounds/boom.mp3");
        this.load.audio("key", "assets/sounds/key.mp3");
        this.load.audio("land", "assets/sounds/land.mp3");
        this.load.audio("step", "assets/sounds/step.mp3");
        this.load.audio("jump", "assets/sounds/jump.mp3");
        this.load.audio("bump1", "assets/sounds/bump1.mp3");
        this.load.audio("bump2", "assets/sounds/bump2.mp3");
        this.load.audio("foeshot", "assets/sounds/foeshot.mp3");
        this.load.audio("death", "assets/sounds/death.mp3");
        this.load.audio("win", "assets/sounds/win.mp3");
        this.load.audio("door", "assets/sounds/door.mp3");
        this.load.audio("splash", "assets/sounds/splash.mp3");
        this.load.audio("outro", "assets/sounds/outro.mp3");
        this.load.audio("music", "assets/sounds/music.mp3");
        this.load.audio("shuriken", "assets/sounds/shuriken.mp3");
        this.load.audio("stone", "assets/sounds/stone.mp3");
        this.load.audio("ice", "assets/sounds/ice.mp3");

        this.load.bitmapFont("runeFont", "assets/fonts/runes.png", "assets/fonts/runes.xml");
        this.load.bitmapFont("mainFont", "assets/fonts/japajese.png", "assets/fonts/japajese.xml");
        this.load.bitmapFont("arcade", "assets/fonts/ipixel.png", "assets/fonts/ipixel.xml");
        this.load.spritesheet("player", "assets/images/player.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("skeleton", "assets/images/foe.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("ice", "assets/images/ice.png", { frameWidth: 32, frameHeight: 32 });

       // this.load.image('map', 'assets/maps/map.png');
        this.load.image('ninjagolf', 'assets/maps/ninjagolf.png');

        Array(10).fill(0).forEach((_,i) => {
            this.load.tilemapTiledJSON(`scene${i}`, `assets/maps/scene${i}.json`);
        });
        //this.load.tilemapTiledJSON("underwater", "assets/maps/underwater.json");

        this.registry.set("score", 0);
        this.registry.set("coins", 0);
        this.registry.set("hull", 10);
    }

    create () {
      }

    createBars () {
        this.loadBar = this.add.graphics();
        this.loadBar.fillStyle(0xaec440, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
