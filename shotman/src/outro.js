export default class Outro extends Phaser.Scene {
    constructor () {
        super({ key: "outro" });
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.introLayer = this.add.layer();
        this.splashLayer = this.add.layer();
        this.text = [ 
            "Finally! Greedy Willie was able",
            "to escape from the haunted mines,", 
            "with enough gold",
            "to buy Twitter and",
            "shut it down forever!"
        ];
        this.showHistory();
        this.addScore();
        this.playMusic();
        this.input.keyboard.on("keydown-SPACE", this.startSplash, this);
        this.input.keyboard.on("keydown-ENTER", this.startSplash, this);
    }

    showHistory () {
        this.text.forEach((line, i) => {
                this.time.delayedCall((i + 1) * 2000, () => this.showLine(line, (i + 1) * 60), null, this); 
        });
        this.time.delayedCall(4000, () => this.showPlayer(), null, this); 
    }

    playMusic (theme="outro") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
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

    showLine(text, y) {
        let line = this.introLayer.add(this.add.bitmapText(this.center_width, y, "pixelFont", text, 25).setOrigin(0.5).setAlpha(0));
        this.tweens.add({
            targets: line,
            duration: 2000,
            alpha: 1
        })
    }

    addScore() {
        this.scoreText = this.add.bitmapText(this.center_width + 32, this.center_height + 215, "shotman", "x" +this.registry.get("score"), 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0).setScrollFactor(0)
        this.scoreLogo = this.add.sprite(this.center_width, this.center_height + 230, "gold0").setScale(0.5).setScrollFactor(0)
      }

    showPlayer() {
        this.player = this.add.sprite(this.center_width, this.center_height + 100, "willie").setScale(3).setOrigin(0.5);
        this.anims.create({
            key: "willieidle",
            frames: this.anims.generateFrameNumbers("willie", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
          });
          this.player.anims.play("willieidle", true);
    }


    startSplash () {
        this.theme.stop();
        this.scene.start("splash");
    }
}
