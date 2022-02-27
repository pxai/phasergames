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
        //this.sound.add("gameover").play();
        this.add.bitmapText(this.center_width, 200, "visitor", "GAME OVER", 100).setDropShadow(0, 10, 0x222222, 0.9).setOrigin(0.5);
        //this.showPlayer();
        //this.playMusic();
        this.add.bitmapText(this.center_width, 300, "visitor", "SCORE: " + this.registry.get("score"), 80).setDropShadow(0, 8, 0x222222, 0.9).setOrigin(0.5);
        this.add.bitmapText(this.center_width - 100, 360, "visitor", "COINS:", 80).setDropShadow(0, 8, 0x222222, 0.9).setOrigin(0.5);
        this.coin = this.add.sprite(this.center_width + 20, 350, "coin").setOrigin(0.5)
        const coinAnimation = this.anims.create({
            key: "coin3",
            frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 13 }, ),
            frameRate: 8,
          });
          this.coin.play({ key: "coin3", repeat: -1 });
          this.add.bitmapText(this.center_width + 100, 360, "visitor", "x" + this.registry.get("coins"), 80).setDropShadow(0, 8, 0x222222, 0.9).setOrigin(0.5);

        this.space = this.add.bitmapText(this.center_width, 570, "visitor", "CLICK HERE to restart", 60).setDropShadow(0, 6, 0x222222, 0.9).setOrigin(0.5);
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
