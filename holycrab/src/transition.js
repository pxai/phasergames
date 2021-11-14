export default class Transition extends Phaser.Scene {
    constructor () {
        super({ key: "transition" });
    }

    init (data) {
        this.name = data.name;
        this.next = data.next;
    }

    create () {
        const ALIGN_CENTER = Phaser.GameObjects.BitmapText.ALIGN_CENTER;
        const messages = {
            "stage1": "Your friend was crabnapped!\nFind the next platform!",
            "stage2": "UP you go!!",
            "stage3": "Go DOWN carefully!!",
            "game_over": "You did it!!",
            "outro": "You did it!!"
        }
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        //this.transition = this.sound.add("transition");
        //this.transition.play();
        this.add.image(this.center_width, this.center_height - 100, "crab").setOrigin(0.5)

        this.add.bitmapText(this.center_width, this.center_height - 20, "arcade", messages[this.next], 40, ALIGN_CENTER).setOrigin(0.5)
        if (this.next !== "game_over")
            this.add.bitmapText(this.center_width, this.center_height + 100, "arcade", "Ready?", 30).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.input.on('pointerdown', (pointer) => this.loadNext(), this);
        setTimeout(() => this.loadNext(), 5000);
    }

    update () {
    }

    loadNext () {
        this.scene.start(this.next, { name: this.name });
    }
}
