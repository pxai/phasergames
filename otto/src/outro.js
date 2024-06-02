export default class Outro extends Phaser.Scene {
    constructor () {
        super({ key: "outro" });
    }

    init (data) {
        this.name = data.name;
        this.number = data.number;
        this.next = data.next;
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.add.sprite(this.center_width, 200, "trophy1").setOrigin(1, 0).setScale(1.4)
        this.add.sprite(this.center_width, 200, "trophy2").setOrigin(0).setScale(1.4)
        this.add.bitmapText(this.center_width, 300, "pixelFont", "CONGRATULATIONS!!", 40).setOrigin(0.5).setTint(0x518ADE)
        this.add.bitmapText(this.center_width, this.center_height - 30, "pixelFont", `Total moves: ${this.registry.get('moves')}`, 50).setOrigin(0.5).setTint(0xDEA551)
        this.add.bitmapText(this.center_width, this.center_height + 30, "pixelFont", "Space to continue", 30).setOrigin(0.5).setTint(0x518ADE)
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
        this.time.delayedCall(20000, () => {
            this.loadNext()
        }, null, this)
    }

    update () {
    }

    loadNext () {
        this.game.sound.stopAll();
        this.scene.start("splash", { number: this.number });
    }
}
