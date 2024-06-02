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
            "game": "ARROWS/WASD + SPACE",
            "underwater": "You lost your engine!",
            "depth": "Time to go down!",
            "escape": "Go up and escape!",
            "outro": "You did it!!"
        }
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;

        this.add.bitmapText(this.center_width, this.center_height - 30, "pixelFont", `Stage ${this.number}/10`, 50).setOrigin(0.5).setTint(0xDEA551)
        this.add.bitmapText(this.center_width, this.center_height + 30, "pixelFont", "Ready?", 30).setOrigin(0.5).setTint(0x518ADE)
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
        this.time.delayedCall(2000, () => {
            this.loadNext()
        }, null, this)
    }

    update () {
    }

    loadNext () {
        this.scene.start("game", { number: this.number });
    }
}
