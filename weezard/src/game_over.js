import Player from "./player";
import Pot from "./pot";

export default class GameOver extends Phaser.Scene {
    constructor () {
        super({ key: "game_over" });
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.playMusic();

        this.showAnimations();
       this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
    }

    
    playMusic (theme="inception") {
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

    showAnimations() {
        this.initial();
    }

    initial () {
        this.mirror = this.add.sprite(this.center_width, this.center_height - 60, "mirror").setOrigin(0.5);
        this.add.bitmapText(this.center_width, this.center_height + 60, "wizardFont", "Game Over", 42).setOrigin(0.5)
        this.anims.create({
            key: "mirrorend",
            frames: this.anims.generateFrameNumbers("mirror", { start: 0, end: 18 }),
            frameRate: 4,
        });

        this.mirror.anims.play("mirrorend", true)
        this.time.delayedCall(4000, () => this.fadeToBlack())
    }


    fadeToBlack () {
        this.fade = this.add.rectangle(0, 0, 2000, 2600, 0x000000).setAlpha(0)
        this.tweens.add({
            targets: this.fade,
            alpha: { from: 0, to: 1},
            duration: 5000,
            onComplete: () => {
                this.loadNext()
            }
        })
    }

    loadNext() {
        this.theme.stop();
        this.scene.start('splash')
    }
}
