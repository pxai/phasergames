import names from "./names";

export default class Transition extends Phaser.Scene {
    constructor () {
        super({ key: "transition" });
    }

    init (data) {
        this.registry.set("name", Phaser.Math.RND.pick(names))
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
        this.addStartButton();
        this.add.bitmapText(this.center_width, this.center_height - 20, "doomed", "READY FOR NEXT STAGE", 40).setOrigin(0.5);
        this.add.bitmapText(this.center_width, this.center_height + 20, "doomed", this.registry.get("name"), 30).setOrigin(0.5);
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.time.delayedCall(1000, () => this.loadNext(), null, this);
    }

    update () {
    }

    loadNext () {
        this.scene.start("game", { name: this.name, number: this.number });
    }

    addStartButton () {
        this.startButton = this.add.bitmapText(this.center_width, 670, "doomed", "Click HERE to continue", 30).setOrigin(0.5).setTint(this.primaryColor).setDropShadow(2, 3, this.tertiaryColor, 0.7);
        this.startButton.setInteractive();
        this.startButton.on("pointerdown", () => {
            this.loadNext();
        });
    
        this.startButton.on("pointerover", () => {
            this.startButton.setTint(0x3E6875);
        });
    
        this.startButton.on("pointerout", () => {
            this.startButton.setTint(0xffffff);
        });
        this.tweens.add({
            targets: this.startButton,
            duration: 300,
            alpha: { from: 0, to: 1 },
            repeat: -1,
            yoyo: true
        });
    }
}

