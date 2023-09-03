import Bubble from "./bubble";
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

        this.backLayer = this.add.layer();
        this.generateBubbles ()
        this.cameras.main.setBackgroundColor(0x000000);
        this.showTitle();        ;

        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        this.input.keyboard.on("keydown-ENTER", () => this.startGame(), this);
        //this.playMusic();
        //this.showPlayer();
    }

    startGame () {
        if (this.theme) this.theme.stop();
        this.scene.start("transition")
    }


    showTitle () {
        this.textShadow1 = this.add.bitmapText(this.center_width, 100, "default", "DUNGEON", 85).setTint(0x25131a).setOrigin(0.5);
        this.textShadow2 = this.add.bitmapText(this.center_width, 250, "default", "BOBBLE", 85).setTint(0x25131a).setOrigin(0.5);
        this.text1 = this.add.bitmapText(this.center_width, 100, "default", "DUNGEON", 85).setTint(0x3d253b).setOrigin(0.5);
        this.text2 = this.add.bitmapText(this.center_width, 250, "default", "BOBBLE", 85).setTint(0x3d253b).setOrigin(0.5);
        this.text11 = this.add.bitmapText(this.center_width, 100, "default", "DUNGEON", 88).setTint(0x302030).setOrigin(0.5);
        this.text22 = this.add.bitmapText(this.center_width, 250, "default", "BOBBLE", 88).setTint(0x302030).setOrigin(0.5);
        this.tweens.add({
            targets: [this.textShadow1, this.textShadow2],
            duration: 1000,
            x: "+=10",
            y: "+=10",
            yoyo: true,
            repeat: -1
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

    showPlayer () {

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

    generateBubbles () {
        this.timer = this.time.addEvent({ delay: 1000, callback: () => {
            console.log("Generating layer bubble")
            new Bubble(this, Phaser.Math.Between(0, this.width), 400)
        }, callbackScope: this, loop: true });
    }
  

    showInstructions() {
        this.add.bitmapText(this.center_width, 430, "default", "WASD/Arrows: move", 30).setOrigin(0.5);
        this.add.sprite(this.center_width - 60, 490, "pello").setOrigin(0.5).setScale(0.3)
        this.add.bitmapText(this.center_width + 40, 490, "default", "By PELLO", 15).setOrigin(0.5);
        this.space = this.add.bitmapText(this.center_width, 550, "default", "Press SPACE to start", 25).setOrigin(0.5);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
}
