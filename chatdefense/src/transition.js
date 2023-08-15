export default class Transition extends Phaser.Scene {
    constructor () {
        super({ key: "transition" });
    }

    init () {
    }

    preload () {
        this.load.image("pello", "assets/images/pello.png");
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;

        this.logo = this.add.sprite(this.center_width, this.center_height, "pello").setOrigin(0.5);
        this.add.bitmapText(this.center_width, this.center_height + 20, "mainFont", "Pello", 30).setOrigin(0.5).setDropShadow(1, 2, 0xbf2522, 0.7);

        this.tweens.add({
            targets: this.logo,
            duration: 1000,
            y: {
                from: -200,
                to: this.center_height
            }
        });

        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.time.delayedCall(2000, () => this.loadNext(), null, this);
    }

    update () {
    }

    loadNext () {
        this.scene.start("game");
    }
}
