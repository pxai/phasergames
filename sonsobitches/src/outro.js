export default class Outro extends Phaser.Scene {
    constructor () {
        super({ key: "outro" });
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
        this.player = this.add.sprite(this.center_width, this.center_height - 120, "player").setOrigin(0.5).setScale(2)
        this.anims.create({
            key: "startidle",
            frames: this.anims.generateFrameNumbers("willie", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });
          this.sound.add("win").play()
          this.player.anims.play("startidle")
          this.scoreCoins = this.add.bitmapText(this.center_width, 50, "default", "Score: " + this.registry.get("score"), 25).setOrigin(0.5).setScrollFactor(0)
        this.add.bitmapText(this.center_width, this.center_height + 40, "default", "Press space to restart", 25).setOrigin(0.5)
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
    }

    update () {
    }

    loadNext () {
        this.scene.start("splash");
    }
}
