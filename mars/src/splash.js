import { ShotSmoke } from "./particle";

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


        this.cameras.main.setBackgroundColor(0x000000);
        //this.showLogo();        ;
        this.smokeLayer = this.add.layer();
        this.showTitle();
        this.time.delayedCall(1000, () => this.showInstructions(), null, this);

        this.input.keyboard.on("keydown-SPACE", () => this.startGame(), this);
        this.playMusic();
        //this.showPlayer();
    }

    showTitle () {
        const shot = this.sound.add("shot");
        const cock = this.sound.add("cock");
        "Marstranded".split("").forEach((letter, i) => {
            this.time.delayedCall(200 * (i+1),
                () => {
                    shot.play();shot.resume();
                    let text = this.add.bitmapText((70 * i) + 80, 200, "pico", letter, 70).setTint(0xca6702).setOrigin(0.5).setDropShadow(4, 6, 0xf09937, 0.9)
                    Array(Phaser.Math.Between(4, 8)).fill(0).forEach( j => { this.smokeLayer.add(new ShotSmoke(this, (70 * i) + 80 + Phaser.Math.Between(-30, 30), 200 + Phaser.Math.Between(-30, 30), 0, -1))});
                },
                null,
                this
            );
        })
        this.time.delayedCall(200 * 8, () => {
            cock.play();cock.resume();
            this.add.sprite(this.center_width - 128, 350, "willie", 0)
            this.add.sprite(this.center_width + 32, 350, "ghosts")
        }, null, this);
    }


    startGame () {
        if (this.theme) this.theme.stop();
        this.sound.add("cock").play();
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

    playMusic (theme="splash") {
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
  

    showInstructions() {
        this.add.bitmapText(this.center_width, 450, "pico", "WASD - Arrows: move", 50).setOrigin(0.5);
        this.add.bitmapText(this.center_width, 500, "pico", "SPACE: shoot!", 50).setOrigin(0.5);
        this.add.sprite(this.center_width - 110, 600, "pello").setOrigin(0.5).setScale(0.4)
        this.add.bitmapText(this.center_width + 60, 600, "pico", "By PELLO", 35).setOrigin(0.5);
        this.space = this.add.bitmapText(this.center_width, 670, "pico", "Press SPACE to start", 30).setOrigin(0.5);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
}
