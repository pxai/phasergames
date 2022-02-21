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
        this.sound.add("gameover").play();
        this.add.bitmapText(this.center_width, 200, "pixelFont", "GAME OVER", 50).setOrigin(0.5);
        //this.showPlayer();
        //this.playMusic();
        this.add.bitmapText(this.center_width, 300, "pixelFont", "SCORE: " + this.registry.get("score"), 40).setOrigin(0.5);

        this.space = this.add.bitmapText(this.center_width, 670, "pixelFont", "CLICK HERE to start", 30).setOrigin(0.5);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });

        this.space.setInteractive();
        this.space.on('pointerdown', () => {
            this.sound.add("change").play();
            this.startSplash()
        })
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


    startSplash () {
        // this.theme.stop();
        this.scene.start("splash");
    }
}
