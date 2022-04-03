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
            "game": "Use WAD keys",
            "underwater": "You lost your engine!",
            "depth": "Time to go down!",
            "escape": "Go up and escape!",
            "outro": "You did it!!"
        }
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(0x210707);
        this.add.bitmapText(this.center_width, this.center_height - 40, "western", messages[this.next], 80).setOrigin(0.5).setTint(0x9A5000).setDropShadow(3, 4, 0x693600, 0.7)
        this.add.bitmapText(this.center_width, this.center_height + 40, "western", "Ready?", 60).setOrigin(0.5).setTint(0x9A5000).setDropShadow(3, 4, 0x693600, 0.7)

        this.startButton = this.add.bitmapText(this.center_width, this.center_height + 200, "western", "START", 60).setOrigin(0.5).setTint(0x9A5000).setDropShadow(3, 4, 0x693600, 0.7)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
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
    }

    update () {
    }

    loadNext () {
        this.sound.add("steam").play();
        this.scene.start("game", { name: this.name, number: this.number });
    }
}
