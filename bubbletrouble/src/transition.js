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

        this.gameLayer = this.add.layer();
        this.tvLayer = this.add.layer();

        this.gameLayer.add(this.add.bitmapText(this.center_width, this.center_height - 20, "pixelFont", messages[this.next], 40).setOrigin(0.5))
        this.gameLayer.add(this.add.bitmapText(this.center_width, this.center_height + 20, "pixelFont", "Ready?", 30).setOrigin(0.5))
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);

        this.addTvEffect();
    }

    update () {
    }

    addTvEffect (lineSpacing = 4, color = 0x000000, alpha = 1) {
        for (let y = 0; y < this.scale.height; y += lineSpacing) {
            this.tvLayer.add(this.add.rectangle(this.center_width, y, this.scale.width, 1, color).setAlpha(alpha));
        }
    }

    loadNext () {
        this.scene.start(this.next, { name: this.name, number: this.number });
    }
}
