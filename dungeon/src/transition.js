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

        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.key = this.add.sprite(this.center_width, this.center_height - 120, "keys", 0).setOrigin(0.5).setScale(2)

        this.add.bitmapText(this.center_width, this.center_height - 20, "default", "GET ALL KEYS", 30).setOrigin(0.5)
        this.add.bitmapText(this.center_width, this.center_height + 40, "default", "from all rooms!", 25).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
    }

    update () {
    }

    loadNext () {
        this.scene.start("game");
    }
}
