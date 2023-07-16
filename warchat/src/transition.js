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
        const messages = {
            game: "Entering Arena",
            underwater: "You lost your engine!",
            depth: "Time to go down!",
            escape: "Go up and escape!",
            outro: "You did it!!"
        };
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;

        this.add.bitmapText(this.center_width, this.center_height - 20, "mainFont", messages[this.next], 40).setOrigin(0.5).setTint(0xFFD700).setDropShadow(1, 2, 0xbf2522, 0.7);
        this.add.bitmapText(this.center_width, this.center_height + 20, "mainFont", "Ready?", 30).setOrigin(0.5).setDropShadow(1, 2, 0xbf2522, 0.7);
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
        this.time.delayedCall(1000, () => this.loadNext(), null, this);
    }

    update () {
    }

    loadNext () {
        this.scene.start(this.next, { name: this.name, number: this.number });
    }
}
