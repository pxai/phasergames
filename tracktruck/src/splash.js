import configScene1 from "./scenes/stage1/config";

export default class Splash extends Phaser.Scene {
    constructor () {
        super({ key: "splash" });
    }

    preload () {
        console.log("splash");
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;

        this.input.keyboard.on("keydown-SPACE", () => this.scene.start("transition", {name: "STAGE", number: 1, time: 30}), this);
    }
}
