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
        const messages = ["Goblin Factory", "STAGE 1", "STAGE 2", "STAGE 3", "STAGE 4" ];
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;

        this.add.sprite(this.center_width, this.center_height - 170, "walt", 5);
        this.add.bitmapText(this.center_width, this.center_height - 20, "celtic", messages[this.number], 40).setOrigin(0.5).setTint(0x1c6c00).setDropShadow(3, 4, 0xfffd00, 0.2);
        this.add.bitmapText(this.center_width, this.center_height + 320, "celtic", "Ready?", 30).setOrigin(0.5).setTint(0x1c6c00).setDropShadow(3, 4, 0xfffd00, 0.2);
        this.add.bitmapText(this.center_width, this.center_height + 70, "celtic", "Jump on cakes", 30).setOrigin(0.5).setTint(0xf09937).setDropShadow(3, 4, 0xfffd00, 0.2);
        this.add.bitmapText(this.center_width, this.center_height + 120, "celtic", "to produce muffins!", 30).setOrigin(0.5).setTint(0xf09937).setDropShadow(3, 4, 0xfffd00, 0.2);
        this.add.bitmapText(this.center_width, this.center_height + 170, "celtic", "Move down to smash faster", 30).setOrigin(0.5).setTint(0xf09937).setDropShadow(3, 4, 0xfffd00, 0.2);
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
