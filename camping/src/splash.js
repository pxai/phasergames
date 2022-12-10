import { ShotSmoke } from "./particle";
import Lightning from "./lightning";

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
        this.loadAudios();
        this.setLightning();

        //this.cameras.main.setBackgroundColor(0x000000);
        //this.showLogo();        ;
      //  this.smokeLayer = this.add.layer();
        this.showTitle();
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        this.playMusic();
        //this.showPlayer();
    }

    setLightning () {
        //this.lightsOut = this.add.rectangle(0, 0, this.width + 200, this.height + 500, 0x0).setOrigin(0).setScrollFactor(0)
        //this.lightsOut.setAlpha(0);
        this.lightningEffect = this.add.rectangle(0, 0, this.width + 200, this.height + 500, 0xffffff).setOrigin(0).setScrollFactor(0)
        this.lightningEffect.setAlpha(0);
        this.lightning = new Lightning(this);
        this.lightning.dewIt();
      }

    showTitle () {
        this.step = this.sound.add("step")
       // this.background = this.add.rectangle(0,0, 800, 800, 0xffffff).setOrigin(0)
        this.add.image(0, 0, "title").setOrigin(0)
    }


    startGame () {
        if (this.theme) this.theme.stop();
        this.sound.add("blip").play();
        this.scene.start("transition", {next: "game", name: "STAGE", number: 0, time: 30})
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

    loadAudios () {
        this.audios = {          
          "thunder0": this.sound.add("thunder0"),
          "thunder1": this.sound.add("thunder1"),
          "thunder2": this.sound.add("thunder2"),
          "thunder3": this.sound.add("thunder3"),
        };
      }

    playAudioRandomly(key) {
        const volume = Phaser.Math.Between(0.8, 1);
        const rate = Phaser.Math.Between(0.8, 1);
        this.audios[key].play({volume, rate});
    }

    playMusic (theme="mars_background") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 2,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
      }
  

    showInstructions() {
        this.add.bitmapText(this.center_width, 530, "dark", "WASD/Arrows", 40).setTint(0xffffff).setOrigin(0.5).setDropShadow(0, 3, 0xcccccc, 0.9)
        this.space = this.add.bitmapText(this.center_width, 580, "dark", "SPACE start", 30).setTint(0xffffff).setOrigin(0.5).setDropShadow(0, 2, 0xcccccc, 0.9);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
}
