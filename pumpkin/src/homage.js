export default class Homage extends Phaser.Scene {
    constructor () {
        super({ key: "homage" });
    }

    init (data) {
        console.log("homage", data);
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
        this.add.image(this.center_width, this.center_height - 100, "zx");
        this.titleTest = this.add.bitmapText(this.center_width, this.center_height, "zxFont", "In Memory of", 20).setOrigin(0.5)
        this.titleTest = this.add.bitmapText(this.center_width, this.center_height + 30, "zxFont", "Sir Clive Sinclair", 30).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        setTimeout(() => this.loadNext(), 3000);
    }

    update () {
    }

    loadNext(sceneName) {
        this.scene.start('transition', {index: -1, scenes: this.scenes })
    }
}
