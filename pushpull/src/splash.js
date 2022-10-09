export default class Splash extends Phaser.Scene {
    constructor () {
        super({ key: "splash" });
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.background = this.add.tileSprite(0, 0, 1024, 1024, "background").setOrigin(0);

        this.cameras.main.setBackgroundColor(0x3c97a6);
        //this.showLogo();        ;
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);
        this.addStartButton();
        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        //this.playMusic();
        //this.showPlayer();
        this.showTitle();
        this.addStartButton();
    }

    update () {
        this.background.tilePositionX += 1;
        this.background.tilePositionY += 1;
    }

    startGame () {
        if (this.theme) this.theme.stop();
        this.playGameMusic();
        this.scene.start("transition", {name: "STAGE", number: 0})
    }

    showTitle() {
        this.gameLogo1 = this.add.bitmapText(this.center_width - 1000, 120, "mario", "Push", 90).setOrigin(0.5).setTint(0xffffff).setDropShadow(3, 4, 0x75b947, 0.7);//.setTint(0xa6f316).setDropShadow(3, 4, 0x75b947, 0.7);
        this.gameLogo2 = this.add.bitmapText(this.center_width + 1000, 220, "mario", "Pull", 100).setOrigin(0.5).setTint(0xffe066).setDropShadow(2, 3, 0x693600, 0.7);
       
        this.tweens.add({
            targets: [this.gameLogo2],
            duration: 1000,
            x: {from: this.gameLogo2.x, to: this.center_width},
            onComplete: () => {
                this.tweens.add({
                    targets: [this.gameLogo2],
                    duration: 1000,
                    x: "-=20",
                    repeat: -1,
                    ease: 'Linear'
                 })
            }
         })
         this.tweens.add({
            targets: [this.gameLogo1],
            duration: 1000,
            x: {from: this.gameLogo1.x, to: this.center_width},
            onComplete: () => {
                this.tweens.add({
                    targets: [this.gameLogo1],
                    duration: 1000,
                    x: "+=20",
                    repeat: -1 ,
                    ease: 'Linear'
                 })
            }
         })

    }

    showLogo() {
        this.gameLogo = this.add.image(this.center_width*2, -200, "logo").setScale(0.5).setOrigin(0.5)
        this.tweens.add({
            targets: this.gameLogo,
            duration: 1000,
            x: {
              from: this.center_width * 2,
              to: this.center_width
            },
            y: {
                from: -200,
                to: 130
              },
          })
    }

    playMusic (theme="splash") {
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

      playGameMusic (theme="music") {
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

      showPlayer () {
        this.frog = this.add.sprite(this.center_width, 350, "block_blue").setOrigin(0.5).setScale(1.5);
    }
  
    addStartButton () {
        this.startButton = this.add.bitmapText(this.center_width, 500, "mario", "Click to start", 30).setOrigin(0.5).setTint(0xffe066).setDropShadow(2, 3, 0x693600, 0.7);
        this.startButton.setInteractive();
        this.startButton.on('pointerdown', () => {
            this.sound.add("move").play();
            this.startGame();
        });
    
        this.startButton.on('pointerover', () => {
            this.startButton.setTint(0x3E6875)
        });
    
        this.startButton.on('pointerout', () => {
            this.startButton.setTint(0xffe066)
        });
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }

    showInstructions() {
        this.add.sprite(this.center_width - 80, 420, "pello").setOrigin(0.5).setScale(0.5)
        this.add.bitmapText(this.center_width + 40, 420, "mario", "By PELLO", 15).setOrigin(0.5);

        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
}
