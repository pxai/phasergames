import Phaser from "phaser";

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
        this.addBackground()
        this.createTitle()
        this.registry.set("playerScore", "0");
        this.registry.set("foeScore", "0");
        this.input.keyboard.on("keydown-ENTER", () => this.startGame(), this);
        this.input.on('pointerdown', () => this.startGame(), this);
        this.playMusic();
        this.showInstructions();
    }

    createTitle () {
        this.title1 = this.add.bitmapText(this.center_width - 200, 250, "starshipped", "Star", 114).setOrigin(0.5);
        this.title2 = this.add.bitmapText(this.center_width + 130, 320, "starshipped", "Shipped", 114).setOrigin(0.5);
        this.title1.setDropShadow(6, 6, 0xffffff)
        this.title2.setDropShadow(6, 6, 0xffffff)
        this.startTween()

    }

    startTween () {
        this.tweens.add({
            targets: [this.title1, this.title2],
            duration: Phaser.Math.Between(1000, 3000),
            tint: {from: 0xFFFA00, to: 0xFFFAc0},
            repeat: -1,
            yoyo: true,
            ease: 'Linear',
        })
    }
    startGame () {
        this.theme.stop();
        this.scene.start("game");
    }

    playMusic () {
        if (this.theme) this.theme.stop()
        this.theme = this.sound.add("splash", {
            mute: false,
            volume: 0.6,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });
        this.theme.play({volume: 0.6});
    }

    showInstructions() {
        this.add.bitmapText(this.center_width, 500, "arcade", "Use MOUSE to move and shoot", 30).setOrigin(0.5);
        this.add.bitmapText(this.center_width, 550, "arcade", "Stay inside the camera view!", 30).setOrigin(0.5);
        // this.add.bitmapText(this.center_width, 500, "pixelFont", "SPACE: speed up", 30).setOrigin(0.5);
              this.space = this.add.bitmapText(this.center_width, 600, "arcade", "Click to START!", 25).setOrigin(0.5);
        this.tweens.add({
            targets: this.space,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
        this.add.sprite(this.center_width - 70, 740, "pello").setOrigin(0.5).setScale(0.3)
        this.add.bitmapText(this.center_width + 40, 740, "arcade", "By PELLO", 25).setOrigin(0.5);
    }

    addBackground () {
    }
}
