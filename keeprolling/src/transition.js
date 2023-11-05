export default class Transition extends Phaser.Scene {
    constructor () {
        super({ key: "transition" });
    }

    init (data) {
        this.number = data.number;
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;

        this.add.bitmapText(this.center_width, this.center_height - 40, "default", `Stage: ${this.number + 1}/9`, 40).setOrigin(0.5)
        this.add.bitmapText(this.center_width, this.center_height, "default", `Points: ${this.registry.get('points')}`, 40).setOrigin(0.5)
        this.add.bitmapText(this.center_width, this.center_height + 60, "default", "Ready?", 30).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
        this.time.delayedCall(2000, () => { this.loadNext() }, null, this)
    }

    loadNext () {
        this.sound.add("blip").play()
        if (this.number < 1)
            this.scene.start("game", {  number: this.number });
        else
            this.scene.start("outro");
    }
}
