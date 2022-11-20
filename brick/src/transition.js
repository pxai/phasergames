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
        this.cameras.main.setBackgroundColor(0x006fb1);
        this.add.bitmapText(this.center_width, this.center_height - 20, "mario", "Stage " + this.number, 40).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
        this.add.bitmapText(this.center_width, this.center_height + 40, "mario", "Ready?", 30).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);

        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
        this.input.on('pointerdown', (pointer) => this.loadNext(), this);
        this.time.delayedCall(1000, () => this.loadNext(), null, this)
    }

    update () {
    }

    loadNext () {
        if (this.number < 7) {
            this.scene.start("game", { name: this.name, number: this.number });
        } else {
            this.sound.stopAll();
            this.scene.start("outro");
        }

    }
}
