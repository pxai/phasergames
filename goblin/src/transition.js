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
        const messages = ["RISE UP!!", "STAGE 1", "STAGE 2", "STAGE 3", "STAGE 4" ];
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;

        this.add.sprite(this.center_width, this.center_height - 170, "walt");
        this.add.bitmapText(this.center_width, this.center_height - 20, "celtic", messages[this.number], 40).setOrigin(0.5)
        this.add.bitmapText(this.center_width, this.center_height + 20, "celtic", "Ready?", 30).setOrigin(0.5)
        this.add.bitmapText(this.center_width, this.center_height + 60, "celtic", "Jump aside to go further!", 30).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
        this.time.delayedCall(3000, () => { this.loadNext() }, null, this)
    }


    update () {
    }

    loadNext () {
        this.scene.start("game", { name: this.name, number: this.number  });
    }

    loadOutro () {
        this.scene.start("outro", { name: this.name, number: this.number });
    }
}
