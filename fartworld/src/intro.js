export default class Intro extends Phaser.Scene {
    constructor () {
        super({ key: "intro" });
    }

    preload () {
        console.log("intro");
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.introLayer = this.add.layer();
        this.splashLayer = this.add.layer();
        this.text = [ 
            "After 10 years of pointless work with his game",
            "Guinxu came to a conclussion...",
            "It was time to embrace Alva Majo's principles:",
            "simple games, nice mechanics and new ideas.",
            "This is the story of how Flat World became..."
        ];
        this.showHistory();
        //this.scene.start("transition", {name: "STAGE1", nextScene: "stage1"})
        this.input.keyboard.on("keydown-ENTER", this.startSplash, this);
    }

    showHistory () {
        this.text.forEach((line, i) => {
                this.time.delayedCall((i + 1) * 2000, () => this.showLine(line, (i + 1) * 60), null, this); 
        });
        this.time.delayedCall(4000, () => this.showPlayer(), null, this); 
    }

    showLine(text, y) {
        let line = this.introLayer.add(this.add.bitmapText(this.center_width, y, "pixelFont", text, 20).setOrigin(0.5).setAlpha(0));
        this.tweens.add({
            targets: line,
            duration: 1000,
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
        this.time.delayedCall(10000, () => this.startSplash(), null, this); 
    }

    startSplash () {
        console.log("Showing logo", this.introLayer);
        this.tweens.add({
            targets: this.introLayer.getChildren(),
            duration: 1000,
            y: -1000,
            onComplete: () => this.scene.start("splash"),
            onCompleteScope: this,
         });
    }
}
