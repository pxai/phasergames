export default class Outro extends Phaser.Scene {
    constructor () {
        super({ key: "outro" });
    }

    init (data) {
        console.log("outro", data);
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
        this.titleTest = this.add.bitmapText(this.center_width, this.center_height, "wizardFont", "OUTRO", 30).setTint(0x902406).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.time.delayedCall(2000, () => this.loadNext());
    }

    update () {
    }

    loadNext(sceneName) {
        this.scene.start("splash", {index: -1, scenes: this.scenes });
    }
}
