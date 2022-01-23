export default class Transition extends Phaser.Scene {
    constructor () {
        super({ key: "transition" });
    }

    init (data) {
        this.number = data.number;
    }

    preload () {
    }

    create () {
        const messages = {
            "game": "ARROWS/WASD + SPACE",
            "underwater": "You lost your engine!",
            "depth": "Time to go down!",
            "escape": "Go up and escape!",
            "outro": "You did it!!"
        }
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        console.log("LETS SEE DATA: ", this.registry.get("life"))
        this.add.bitmapText(this.center_width, this.center_height - 20, "wendy", messages[this.next], 40).setOrigin(0.5)
        this.add.bitmapText(this.center_width, this.center_height + 20, "wendy", "Ready?", 30).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);

        setTimeout(() => this.loadNext(), 1000);
        this.playMusic();
    }

    playMusic (theme="music") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 0.2,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
        })
      }

    update () {
    }

    loadNext () {
        this.scene.start("game", { number: this.number });
    }
}
