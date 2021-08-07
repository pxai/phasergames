import configScene1 from "./scenes/stage1/config";

export default class Splash extends Phaser.Scene {
    constructor () {
        super({ key: "splash" });
    }

    preload () {
        console.log("splash");
    }

    create () {
        this.scene.start("stage1")
        this.input.keyboard.on("keydown-ENTER", () => this.scene.start("stage1"), this);
    }
}
