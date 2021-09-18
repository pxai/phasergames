export default class Splash extends Phaser.Scene {
    constructor () {
        super({ key: "splash" });
    }

    init (data) {
        console.log("splash", data);
        this.index = data.index;
        this.scenes = data.scenes;
    }

    preload () {
        console.log("transition to ", this.scenes);
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.titleTest = this.add.bitmapText(this.center_width, this.center_height, "wizardFont", "INTRO", 30).setTint(0x902406).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        setTimeout(() => this.loadNext(), 1000);
    }

    update () {
    }

    loadNext(sceneName) {
        console.log("Loading next! ");
        this.index++;
        this.scene.start("game", {index: this.index, scenes: this.scenes });
    }
}
