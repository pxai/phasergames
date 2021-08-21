export default class Outro extends Phaser.Scene {
    constructor () {
        super({ key: "outro" });
    }

    preload () {
        console.log("outro");
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.introLayer = this.add.layer();
        this.splashLayer = this.add.layer();
        this.text = [ 
            "Finally our hero Kaki defeated the evil Albat.",
            "After a few years, Guinxu became so important",
            "that even Alva Majo worked for him...",
            "...developing mobile games for money.",
            "But that is another story..."
        ];
        this.showHistory();

        this.input.keyboard.on("keydown-ENTER", this.startSplash, this);
    }

    showHistory () {
        this.text.forEach((line, i) => {
                this.time.delayedCall((i + 1) * 2000, () => this.showLine(line, (i + 1) * 60), null, this); 
        });
        this.time.delayedCall(4000, () => this.showPlayer(), null, this); 
    }

    showLine(text, y) {
        let line = this.introLayer.add(this.add.bitmapText(this.center_width, y, "pixelFont", text, 25).setOrigin(0.5).setAlpha(0));
        this.tweens.add({
            targets: line,
            duration: 2000,
            alpha: 1
        })
    }

    showPlayer () {
        this.player = this.introLayer.add(this.add.sprite(this.center_width, (this.text.length * 60) + 100, "aki").setScale(2).setAlpha(0));
        this.anims.create({
            key: "idlesplash",
            frames: this.anims.generateFrameNumbers("aki", { start: 0, end: 1 }),
            frameRate: 2,
            repeat: -1
        });
        this.tweens.add({
            targets: this.player,
            duration: 1000,
            alpha: 1
        })
        this.player.anims.play("idlesplash")
        this.add.bitmapText(this.center_width, (this.text.length * 60) + 200, "pixelFont", "SCORE: " + this.registry.get("score"), 25).setOrigin(0.5);
        this.time.delayedCall(20000, () => this.startSplash(), null, this); 
    }

    startSplash () {
        this.scene.start("splash");
    }
}
