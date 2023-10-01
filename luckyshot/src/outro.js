export default class Outro extends Phaser.Scene {
    constructor () {
        super({ key: "outro" });
    }

    init (data) {
        this.name = data.name;
        this.number = data.number;
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;

          this.scoreSeconds = this.add.bitmapText(this.center_width, 100, "title", "TRIES: "+ this.registry.get("tries"), 125).setOrigin(0.5).setScrollFactor(0)
        this.add.bitmapText(this.center_width, this.center_height - 20, "title", "YOU DID IT!!", 140).setOrigin(0.5)
        this.add.bitmapText(this.center_width, this.center_height + 40, "title", "CLICK TO RESTART", 125).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.startSplash(), this);
        this.input.keyboard.on("keydown-SPACE", () => this.startSplash(), this);
        this.input.on('pointerdown', (pointer) => this.startSplash(), this);
    }

    startSplash () {
        if (this.theme) this.theme.stop();
        this.sound.add("start").play();
        this.cameras.main.fade(250, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          this.scene.start("splash", { number: 0});
        });
    }

    update () {
    }
}
