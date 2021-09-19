export default class Intro extends Phaser.Scene {
    constructor () {
        super({ key: "intro" });
    }

    init (data) {
        console.log("intro", data);
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
        this.time.delayedCall(1000, () => this.loadNext());
    }

    update () {
    }

    loadNext(sceneName) {
        console.log("Loading next! ");
        this.sound.stopAll();
        this.scene.start('transition', {index: -1, scenes: this.scenes })
    }
}
