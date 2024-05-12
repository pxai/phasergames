export default class Transition extends Phaser.Scene {
    constructor () {
        super({ key: "transition" });
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

        this.add.bitmapText(this.center_width, this.center_height - 20, "pixelFont", "Previously on Amitree...", 40).setOrigin(0.5).setTint(0x0777b7).setDropShadow(1, 2, 0xffffff, 0.7)
        this.add.bitmapText(this.center_width, this.center_height + 20, "pixelFont", "Ready?", 30).setOrigin(0.5).setTint(0x0777b7).setDropShadow(1, 2, 0xffffff, 0.7)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);

        this.time.delayedCall(15000, () => { this.loadNext()}, null, this)
    }

    update () {
    }

    loadNext () {
        this.scene.start("game", { name: this.name, number: this.number });
    }
}
