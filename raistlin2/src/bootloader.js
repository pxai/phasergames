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
                this.progressBar.fillStyle(0xbf2522, 1);
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

        this.load.image("pello", "assets/images/pello.png");
        this.load.image("star", "assets/images/star.png");

        this.load.audio("cast", "assets/sounds/cast.mp3");
        this.load.audio("emptymana", "assets/sounds/emptymana.mp3");
        this.load.audio("fireball", "assets/sounds/fireball.mp3");
        this.load.audio("boom", "assets/sounds/boom.mp3");

        this.load.bitmapFont("runeFont", "assets/fonts/runes.png", "assets/fonts/runes.xml");
        this.load.bitmapFont("mainFont", "assets/fonts/celtic.png", "assets/fonts/celtic.xml");
        this.load.bitmapFont("arcade", "assets/fonts/arcade.png", "assets/fonts/arcade.xml");
        this.load.spritesheet("raistlin", "assets/images/willie.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("skeleton", "assets/images/foe.png", { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet("arrow", "assets/images/arrow.png", { frameWidth: 32, frameHeight: 32 });

        this.load.image('map', 'assets/maps/map.png');

        Array(1).fill(0).forEach((_,i) => {
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
        this.loadBar.fillStyle(0xffe066, 1);
        this.loadBar.fillRect(
            this.cameras.main.width / 4 - 2,
            this.cameras.main.height / 2 - 18,
            this.cameras.main.width / 2 + 4,
            20
        );
        this.progressBar = this.add.graphics();
    }
}
