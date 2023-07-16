export default class Transition extends Phaser.Scene {
    constructor () {
        super({ key: "transition" });
    }

    init (data) {
        this.name = data.name;
        this.number = data.number;
        this.next = data.next;
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

        this.add.bitmapText(this.center_width, this.center_height - 20, "pixelFont", messages[this.next], 40).setOrigin(0.5)
        this.add.bitmapText(this.center_width, this.center_height + 20, "pixelFont", "Ready?", 30).setOrigin(0.5)
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
        this.playMusic("music" + this.number);
        this.time.delayedCall(2000, () => this.loadNext(), null, this);
    }

    playMusic (theme="music1") {
        this.theme = this.sound.add(theme);
        this.theme.play({
          mute: false,
          volume: 0.6,
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
        this.scene.start(this.next, { name: this.name, number: this.number, time: this.time });
    }
}
