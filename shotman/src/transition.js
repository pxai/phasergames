export default class Transition extends Phaser.Scene {
    constructor () {
        super({ key: "transition" });
    }

    init (data) {
        this.number = data.number;
    }

    preload () {
    }

    create () {
        const messages = [
            "Tutorial 0",
            "Tutorial 1",
            "Tutorial 2",
            "Tutorial 3",
            "Let's get serious!",
            "Hurt me if you can",
            "I'll blow you all",
            "Finale"
        ];
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2; 

        if (this.number === 8) {
            this.scene.start("outro", { number: this.number });
        }
        
        this.add.bitmapText(this.center_width, this.center_height - 20, "shotman", messages[this.number], 40).setOrigin(0.5)
        this.add.bitmapText(this.center_width, this.center_height + 20, "shotman", "Ready?", 30).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
        this.time.delayedCall(2000, () => { this.loadNext();}, null, this)
    }

    update () {
    }

    loadNext () {
        this.sound.add("cock").play();
        this.scene.start("game", {  number: this.number });
    }
}
