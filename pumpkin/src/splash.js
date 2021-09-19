import scenes from "./scenes";

export default class Splash extends Phaser.Scene {
    constructor () {
        super({ key: "splash" });
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.titleTest = this.add.bitmapText(this.center_width, this.center_height, "wizardFont", "SPLASH", 30).setTint(0x902406).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.registry.set('lives', 1)
        this.prepareScenes();
    }

    update () {
    }

    prepareScenes () {
        this.scenes = [ 
          scenes[0], 
          ...scenes.slice(1,scenes.length - 2).sort(() => 0.5 - Math.random()),
          scenes[scenes.length - 1]
        ];
        console.log(this.scenes)
    } 

    loadNext(sceneName) {
        console.log("Loading next! ");
        this.scene.start('intro', {index: -1, scenes: this.scenes })
    }
}
