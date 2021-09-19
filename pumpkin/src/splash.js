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
        this.playMusic();
        this.titleTest = this.add.bitmapText(this.center_width, this.center_height, "wizardFont", "SPLASH", 30).setTint(0x902406).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.registry.set('lives', 1)
        this.prepareScenes();
        this.sound.add("spooky4").play();
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

    playMusic (theme="muzik2") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 1,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
    }
}
