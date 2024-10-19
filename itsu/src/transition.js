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
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;

        this.add.bitmapText(this.center_width, this.center_height - 20, "pixelFont", this.number, 40).setOrigin(0.5)
        this.add.bitmapText(this.center_width, this.center_height + 20, "pixelFont", "Prest?", 30).setOrigin(0.5)
       // this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);    
       // this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
       this.time.delayedCall(500, () => this.loadNext(), null, this);

    }

    update () {
    }

    loadNext () {
        console.log("Loading next scene: ", this.number)
        this.scene.start("game", { number: this.number });
    }
}
