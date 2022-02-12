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

        this.anims.create({
            key: "demowalk",
            frames: this.anims.generateFrameNumbers("penguin", { start: 2, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "demojump",
            frames: this.anims.generateFrameNumbers("penguin", { start: 4, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        this.add.bitmapText(this.center_width - 200, 100, "pixelFont", "WASD/ARROWS", 30).setOrigin(0.5)
        this.add.sprite(this.center_width, 100, "up")
        this.add.sprite(this.center_width + 100, 100, "right")
        this.add.sprite(this.center_width + 200, 100, "left")
        this.penguin0 = this.add.sprite(this.center_width + 350, 100, "penguin");
        this.penguin0.anims.play("demowalk", true);

        this.add.bitmapText(this.center_width - 100, 200, "pixelFont", "JUMP & 2 x EXTRA JUMP", 30).setOrigin(0.5)
        this.jumpArrow1 = this.add.sprite(this.center_width + 250, 200, "up")
        this.tweens.add({ targets: this.jumpArrow1, duration: 200, scale: { from: 1, to: 0.8}, repeat: -1});
        this.penguin1 = this.add.sprite(this.center_width + 350, 200, "penguin");
        this.penguin1.anims.play("demojump", true);

        this.add.bitmapText(this.center_width - 100, 300, "pixelFont", "FALL & 10 x FLAPS", 30).setOrigin(0.5)
        this.jumpArrow2 = this.add.sprite(this.center_width + 250, 300, "up")
        this.tweens.add({ targets: this.jumpArrow2, duration: 200, scale: { from: 1, to: 0.8}, repeat: -1});
        this.penguin2 = this.add.sprite(this.center_width + 350, 300, "penguin");
        this.penguin2.anims.play("demojump", true);


        this.add.bitmapText(this.center_width, 500, "pixelFont", "AVOID SEA LEVEL!!", 30).setOrigin(0.5)
        this.add.bitmapText(this.center_width, 600, "pixelFont", "READY? PRESS SPACE", 30).setOrigin(0.5)
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
    }

    update () {
    }

    loadNext () {
        this.scene.start("game");
    }
}
