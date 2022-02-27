
import Player from "./player";

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
        this.addBackground();
        this.addLetters();

        this.time.delayedCall(300, () => this.showInstructions(), null, this);

       // this.playMusic();
        this.addPlayer();
    }

    addLetters () {
        this.add.bitmapText(this.center_width, 150, "visitor", "ELECTRON", 160).setDropShadow(0, 10, 0x222222, 0.9).setOrigin(0.5);
    }

    addBackground () {
        this.background = this.add.tileSprite(0, 0, this.width, this.height, "background").setOrigin(0).setScrollFactor(0, 1); 
      }

    addPlayer() {
        this.trailLayer = this.add.layer();
        this.player = new Player(this, this.center_width, this.center_height)
        this.player.body.setVelocityX(Phaser.Math.Between(-400, 400));
        this.player.body.setVelocityY(Phaser.Math.Between(-400, 400));     
    }

    update () {
        this.player.update();
        this.background.tilePositionY -= 2;
        this.background.tilePositionX += 2;
    }
    startGame () {
        this.scene.start("transition")
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

    showPlayer () {

    }

    playMusic (theme="intro") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 0.7,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
      }
  

    showInstructions() {
       this.add.sprite(this.center_width - 120, 520, "pello").setOrigin(0.5).setScale(0.3)
        this.add.bitmapText(this.center_width, 520, "visitor", "By PELLO", 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0.5);
        this.space = this.add.bitmapText(this.center_width, this.center_height, "visitor", "CLICK HERE to start", 60).setDropShadow(0, 6, 0x222222, 0.9).setOrigin(0.5);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });

        this.space.setInteractive();
        this.space.on('pointerdown', () => {
            this.sound.add("click").play();
            this.startGame()
        })
    }
}
