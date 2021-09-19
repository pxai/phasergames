export default class Homage extends Phaser.Scene {
    constructor () {
        super({ key: "homage" });
    }

    preload () {}

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.add.image(this.center_width, this.center_height - 100, "zx");
        this.playMusic()
        this.titleTest = this.add.bitmapText(this.center_width, this.center_height, "zxFont", "In Memory of", 20).setOrigin(0.5)
        this.titleTest = this.add.bitmapText(this.center_width, this.center_height + 30, "zxFont", "Sir Clive Sinclair", 30).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.time.delayedCall(3000, () => this.loadNext());

    }

    update () {
    }

    loadNext(sceneName) {
        this.scene.start('splash')
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
