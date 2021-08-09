export default class Transition extends Phaser.Scene {
    constructor () {
        super({ key: "transition" });
    }

    init (data) {
        this.nextScene = data.nextScene;
        this.name = data.name;
    }

    preload () {
        console.log("transition to ", this.nextScene);
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.titleTest = this.add.bitmapText(this.center_width, this.center_height, "pixelFont", this.name + " - READY?", 60).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        setTimeout(() => this.loadNext(), 1000);
    }

    update () {
    }

    loadNext(sceneName) {
        console.log("Loading next! ", this.nextScene);
        this.scene.start(this.nextScene);
    }
}
