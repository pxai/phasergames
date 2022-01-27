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
        this.cameras.main.setBackgroundColor(0x222222);
        this.text = [
            " ",
            "The dungeons of terror",
            "and their evil dwellers",
            "were finally wiped out.",
            "Good job Bill!!",
            "I hope that you had fun!",
            " - press space - "
        ];
        this.showHistory();
        this.showPlayer();
        this.setScore();
        //this.playMusic();

        this.input.keyboard.on("keydown-SPACE", this.startSplash, this);
    }

    setScore() {
        this.drillImage = this.add.image(this.width - 400, 40, "drill").setScale(0.5).setOrigin(0.5).setScrollFactor(0)
        this.drillText = this.add.bitmapText(this.width - 360, 40, "wendy", String(this.registry.get("drill")), 40).setOrigin(0.5).setScrollFactor(0)
        this.speedImage = this.add.image(this.width - 320, 40, "lightning").setScale(0.5).setOrigin(0.5).setScrollFactor(0)
        this.speedText = this.add.bitmapText(this.width - 270, 40, "wendy", String(this.registry.get("speed")), 40).setOrigin(0.5).setScrollFactor(0)
        this.shieldImage = this.add.image(this.width - 200, 40, "shield").setScale(0.5).setOrigin(0.5).setScrollFactor(0)
        this.shieldText = this.add.bitmapText(this.width - 150, 40, "wendy", String(this.registry.get("shield")), 40).setOrigin(0.5).setScrollFactor(0)
        this.lifeBarShadow = this.add.rectangle(this.center_width - 101, 40, 208, 34, 0x444444).setOrigin(0.5).setScrollFactor(0)
        this.lifeBar = this.add.rectangle(this.center_width - 100, 40, +this.registry.get("life") * 2 , 30, 0xb06f00).setOrigin(0.5).setScrollFactor(0)
        this.scoreText = this.add.bitmapText(100, 40, "wendy", String(this.registry.get("score")).padStart(6, '0'), 60).setOrigin(0.5).setScrollFactor(0)
      }

    showHistory () {
        this.text.forEach((line, i) => {
                let offset = i === 0 ? 100 : 60
                this.time.delayedCall((i + 1) * 2000, () => this.showLine(line, (i + 1) * offset), null, this); 
        });
        this.time.delayedCall(4000, () => this.showPlayer(), null, this); 
    }

    playMusic (theme="outro") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 1,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
      }

    showLine(text, y) {
        let line = this.introLayer.add(this.add.bitmapText(this.center_width, y, "wendy", text, 50).setOrigin(0.5).setAlpha(0));
        this.tweens.add({
            targets: line,
            duration: 2000,
            alpha: 1
        })
    }

    showPlayer() {
        this.player1 = this.add.sprite(this.center_width, this.height - 200, "player").setOrigin(0.5);

    }
    startSplash () {
        // this.theme.stop();
        this.scene.start("splash");
    }
}
