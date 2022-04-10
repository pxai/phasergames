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

        this.showResult();
        this.showPlayer();
        this.sound.add("outro").play();
        this.input.keyboard.on("keydown-SPACE", this.startSplash, this);
        this.input.keyboard.on("keydown-ENTER", this.startSplash, this);

        this.startButton = this.add.bitmapText(this.center_width, this.center_height + 200, "western", "TRY AGAIN!", 60).setOrigin(0.5).setTint(0x9A5000).setDropShadow(3, 4, 0x693600, 0.7)
 
        this.startButton.setInteractive();
        this.startButton.on('pointerdown', () => {
            this.startSplash();
        });
    
        this.startButton.on('pointerover', () => {
            this.startButton.setTint(0x3E6875)
        });
    
        this.startButton.on('pointerout', () => {
            this.startButton.setTint(0xffffff)
        });
    }

    showResult () {
        this.addScore();
        this.addTNT();
        this.add.bitmapText(this.center_width, 150, "western", "TOO GREEDY!!", 100).setOrigin(0.5).setTint(0x9A5000).setDropShadow(3, 4, 0x693600, 0.7);
    }

    addScore() {
        this.scoreText = this.add.bitmapText(this.center_width + 20, 350, "western", "x" +this.registry.get("score"), 60).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0).setScrollFactor(0)
        this.scoreLogo = this.add.sprite(this.center_width - 40, 375, "gold").setScale(2).setOrigin(0.5).setScrollFactor(0)
        const coinAnimation = this.anims.create({
          key: "goldscore",
          frames: this.anims.generateFrameNumbers("gold", { start: 0, end: 7 }, ),
          frameRate: 8,
        });
        this.scoreLogo.play({ key: "goldscore", repeat: -1 });
      }
  
      addTNT() {
        this.tntText = this.add.bitmapText(this.center_width + 25, 450, "western", "x" +this.registry.get("tnt"), 40).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0).setScrollFactor(0)
        this.tntLogo = this.add.sprite(this.center_width - 25, 475, "tnt").setScale(1).setOrigin(0.5).setScrollFactor(0)
        const coinAnimation = this.anims.create({
          key: "tntscore",
          frames: this.anims.generateFrameNumbers("tnt", { start: 0, end: 2 }, ),
          frameRate: 8,
        });
        this.tntLogo.play({ key: "tntscore", repeat: -1 });
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
        let line = this.introLayer.add(this.add.bitmapText(this.center_width, y, "western", text, 25).setOrigin(0.5).setAlpha(0));
        this.tweens.add({
            targets: line,
            duration: 2000,
            alpha: 1
        })
    }


    startSplash () {
        this.sound.add("yee-haw").play();
        this.scene.start("splash", {name: "", number: 0});
    }

    showPlayer() {
        this.player = this.add.sprite(this.center_width, this.center_height - 130, "willie").setScale(3).setOrigin(0.5);
        this.anims.create({
            key: "willieidle",
            frames: this.anims.generateFrameNumbers("willie", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
          });
          this.player.anims.play("willieidle", true);
    }
}