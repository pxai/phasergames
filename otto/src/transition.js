import Exit from "./exit";

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
        if (this.number === 8)  this.loadOutro();

        const messages = [
            "GET TO THE FLAGS!",
            "USE THE BARRELS!",
            "HIT R TO RESTART",
            "MY GRANDPA IS BETTER",
            "GO AND GET A LIFE",
            "YOU ARE A FAILURE",
            "ALMOST THERE",
            "THIS IS IT"
        ]

        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        new Exit(this, this.center_width, 200, "exit1", 0x518ADE).setOrigin(1, 0).setScale(2)
        new Exit(this, this.center_width, 200, "exit1", 0xDEA551).setOrigin(0).setScale(2)
        this.add.bitmapText(this.center_width, 300, "pixelFont", messages[this.number], 40).setOrigin(0.5).setTint(0x518ADE)
        this.add.bitmapText(this.center_width, this.center_height - 30, "pixelFont", `Stage ${this.number + 1}/8`, 50).setOrigin(0.5).setTint(0xDEA551)
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

    loadOutro () {
        this.scene.start("outro", { number: this.number });
    }
}
