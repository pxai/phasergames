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
        const messages = [
            "DAY 1",
            "DAY 2",
            "DAY 3",
            "DAY 4",
            "DAY 5",
            "DAY 6",
            "DAY 7"
        ];
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2; 

        if (this.number === 8) {
            this.scene.start("outro", { number: this.number });
        }
        
        this.add.bitmapText(this.center_width, this.center_height - 20, "pico", messages[this.number], 40).setOrigin(0.5)
        this.add.bitmapText(this.center_width, this.center_height + 20, "pico", "Audio record of captain Braun", 30).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);

        this.playDiary();
    }

    playDiary () {
        this.sound.add(`diary${this.number}`).play();
      }

    update () {
    }

    loadNext () {
        this.sound.add("cock").play();
        this.scene.start("game", {  number: this.number });
    }
}
