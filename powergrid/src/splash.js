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
        //this.background = this.add.tileSprite(0, 0, 1024, 1024, "background").setOrigin(0);

        this.time.delayedCall(1000, () => this.showInstructions(), null, this);
        this.addStartButton();
        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        this.playMusic();

        this.showTitle();
        this.addStartButton();
    }

    update () {
    }

    startGame () {
        if (this.theme) this.theme.stop();
        this.playGameMusic();
        this.scene.start("transition", {name: "STAGE", number: 0})
    }

    showTitle() {
        this.gameLogo1 = this.add.bitmapText(this.center_width, -1000, "mario", "GRID", 120).setOrigin(0.5).setTint(0xb95e00).setDropShadow(3, 4, 0xfffd00, 0.7);//.setTint(0xa6f316).setDropShadow(3, 4, 0x75b947, 0.7);
        this.gameLogo2 = this.add.bitmapText(this.center_width, +1000, "mario", "POWER", 120).setOrigin(0.5).setTint(0xfffd00).setDropShadow(2, 3, 0xb95e00, 0.7);
        this.bolt = this.add.sprite(this.center_width, this.center_height + 30, "bolt").setAlpha(0)
 
        this.tweens.add({
            targets: [this.gameLogo2],
            duration: 1000,
            y: {from: this.gameLogo2.y, to: this.center_height - 200},
            onComplete: () => {
                this.tweens.add({
                    targets: [this.gameLogo2],
                    duration: 1000,
                    y: "-=20",
                    repeat: -1,
                    ease: 'Linear'
                 })
                this.tweens.add({
                    targets: [this.bolt],
                    alpha: {from: 0.5, to: 1},
                    duration: 100,
                    repeat: -1
                })
               
            }
         })
         this.tweens.add({
            targets: [this.gameLogo1],
            duration: 1000,
            y: {from: this.gameLogo1.y, to: this.center_height - 100},
            onComplete: () => {
                this.tweens.add({
                    targets: [this.gameLogo1],
                    duration: 1000,
                    y: "+=20",
                    repeat: -1 ,
                    ease: 'Linear'
                 })
            }
         })

    }

    playMusic (theme="splash") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 0.5,
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
          volume: 0.2,
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
        this.startButton = this.add.bitmapText(this.center_width, 540, "mario", "start", 30).setOrigin(0.5).setTint(0xfffd00).setDropShadow(2, 3, 0x693600, 0.7);
        this.startButton.setInteractive();
        this.startButton.on('pointerdown', () => {
            this.sound.add("move").play();
            this.startGame();
        });
    
        this.startButton.on('pointerover', () => {
            this.startButton.setTint(0x3E6875)
        });
    
        this.startButton.on('pointerout', () => {
            this.startButton.setTint(0xfffd00)
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
        this.add.sprite(this.center_width - 80, 450, "pello").setOrigin(0.5).setScale(0.5)
        this.add.bitmapText(this.center_width + 40, 450, "mario", "By PELLO", 15).setOrigin(0.5);

        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
}
