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
            this.scene.start("game", { next: "game", name: "STAGE", number: 0, time: 30 });
        }, this);

        Array(4).fill(0).forEach((e, i) => { this.load.audio(`thunder${i}`, `./assets/sounds/thunder${i}.mp3`);})

        this.load.image("pello", "assets/images/pello.png");
        this.load.image("logo", "assets/images/logo.png");
        this.load.image("attack", "assets/images/items/sword0.png");
        this.load.image("defense", "assets/images/items/shield.png");

        //this.load.audio("step", "assets/sounds/step.mp3");

        const images = [
            "axe.png", "big_rat.png", "dagger.png", "elixir3.png", "monster.png", "potion3.png", "shield1.png", "staff3.png", "tile_0085.png",
            "barbarian.png", "chaos_warrior.png", "dwarf.png", "evil_chest.png", "paladin.png", "priest.png", "shiled0.png", "sword0.png", "tile_0086.png",
            "barbarian2.png", "chest0.png", "elixir0.png", "ghost.png", "potion0.png", "princess.png", "spider.png", "sword1.png", "warlock.png",
            "bat.png", "chest2.png", "elixir1.png", "hammer.png", "potion1.png", "rat.png", "staff1.png", "sword2.png", "wizard.png",
            "battle_axe.png", "chest3.png", "elixir2.png", "knight.png", "potion2.png", "scorpion.png", "staff2.png", "sword3.png", "wrath.png"
        ];

        images.forEach(image => {
            this.load.image(image.split(".")[0], `assets/images/items/${image}`);
        });


        this.load.bitmapFont("mainFont", "assets/fonts/adumu.png", "assets/fonts/adumu.xml");
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
