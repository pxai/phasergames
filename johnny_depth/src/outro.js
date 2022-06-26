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
        this.add.image(0,0, "background").setOrigin(0);
        this.introLayer = this.add.layer();
        this.splashLayer = this.add.layer();

        this.text = [ 
            "You escaped from Atlantis!",
            "After all your efforts,",
            "nobody will believe",
            "what you saw here...",
            "maybe you got some coins though...",
            "",
            "",
            "",
            "ENTER/SPACE to start again!"
        ];
        this.showHistory();

        //this.showPlayer();
        this.playMusic();
        this.input.keyboard.on("keydown-SPACE", this.startSplash, this);
        this.input.keyboard.on("keydown-ENTER", this.startSplash, this);
    }

    showHistory () {
        this.text.forEach((line, i) => {
                this.time.delayedCall((i + 1) * 2000, () => this.showLine(line, (i + 1) * 50), null, this); 
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
        let line = this.introLayer.add(this.add.bitmapText(this.center_width, y, "pixelFont", text, 20).setTint(0x472e26).setOrigin(0.5).setAlpha(0));
        this.tweens.add({
            targets: line,
            duration: 2000,
            alpha: 1
        })
    }

    showPlayer () {
        this.player = this.add.sprite(this.center_width, 350, "ember_head").setScale(0.8);
        this.anims.create({
            key: "playeridle",
            frames: this.anims.generateFrameNumbers("ember_head"),
            frameRate: 5,
            repeat: -1
        });
        this.player.anims.play("playeridle", true)
    }

    startSplash () {
        this.theme.stop();
        this.scene.start("splash");
    }
}
