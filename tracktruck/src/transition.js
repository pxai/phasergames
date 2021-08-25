export default class Transition extends Phaser.Scene {
    constructor () {
        super({ key: "transition" });
    }

    init (data) {
        this.name = data.name;
        this.number = data.number;
        this.time = data.time;
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.horn = this.sound.add("horn");
        this.horn.play();
        this.titleTest = this.add.bitmapText(this.center_width, this.center_height, "pixelFont", this.name + " " + this.number + " - READY?", 30).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);

        setTimeout(() => this.loadNext(), 1000);
    }

    update () {
    }

    loadNext (sceneName) {
        this.scene.start("game", { name: this.name, number: this.number, time: this.time });
    }
}
