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

        this.add.bitmapText(this.center_width, this.center_height - 20, "pixelFont", messages[this.next], 40).setOrigin(0.5)
        this.add.bitmapText(this.center_width, this.center_height + 20, "pixelFont", "Ready?", 30).setOrigin(0.5)
        this.add.bitmapText(this.center_width, this.center_height + 60, "pixelFont", "SPACE to START", 30).setOrigin(0.5)

        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
        this.time.delayedCall(1000, () => this.loadNext(), null, this)
    }

    update () {
    }

    loadNext () {
        console.log("About to load next: ", this.number)
        if (this.number < 6) {
            this.scene.start("game", { name: this.name, number: this.number });
        } else {
            this.sound.stopAll();
            this.scene.start("outro");
        }

    }
}
