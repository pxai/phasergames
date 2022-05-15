export default class Transition extends Phaser.Scene {
    constructor () {
        super({ key: "transition" });
    }

    init (data) {
        this.name = data.name;
        this.number = data.number;
    }

    preload () {
    }

    create () {
        const messages = [
            "Tutorial 1",
            "Tutorial 2",
            "Stage1",
            "Stage2",
            "Outro"
        ]

        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(0x3c97a6);
        this.addStartButton();
        this.add.bitmapText(this.center_width, this.center_height - 20, "mario", messages[this.number], 40).setOrigin(0.5).setTint(0xa6f316).setDropShadow(2, 3, 0x75b947, 0.7);
        this.add.bitmapText(this.center_width, this.center_height + 20, "mario", "Ready?", 30).setOrigin(0.5).setTint(0xa6f316).setDropShadow(2, 3, 0x75b947, 0.7);
        this.time.delayedCall(2000, () => this.loadNext(), null, this);
    }

    update () {
    }

    addStartButton () {
        this.startButton = this.add.bitmapText(this.center_width, 500, "mario", "Click to start", 30).setOrigin(0.5).setTint(0x9A5000).setDropShadow(2, 3, 0x693600, 0.7);
        this.startButton.setInteractive();
        this.startButton.on('pointerdown', () => {
            this.loadNext();
        });
    
        this.startButton.on('pointerover', () => {
            this.startButton.setTint(0x3E6875)
        });
    
        this.startButton.on('pointerout', () => {
            this.startButton.setTint(0xffffff)
        });
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }

    loadNext () {
        this.scene.start("game", { name: this.name, number: this.number });
    }
}
