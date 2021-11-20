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

        this.title = this.add.bitmapText(this.center_width, 100, "arcade", "METABOLIK", 114).setOrigin(0.5);
        this.startTween()
        this.setBlocks();
        this.input.keyboard.on("keydown-ENTER", () => this.startGame(), this);
        this.playMusic();
        this.showInstructions();
    }

    startTween () {
        this.tweens.add({
            targets: this.title,
            duration: 300,
            scale: {from: 0.7, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
    startGame () {
        this.theme.stop();
        this.scene.start("game");
    }

    setBlocks () {
        const color = ["red", "blue", "green"]
        let lastColor = "red";
        Array(3).fill(0).forEach( (r, j) => {
            Array(3).fill(0).forEach( (row, i) => {
                lastColor = Phaser.Math.Between(0, 2)
                this.add.image(300 + (i * 32), 200 + (j * 32), color[lastColor]).setOrigin(0.5)
            }) 
        })

        this.block = this.add.image(592, 264, color[lastColor]);
        this.tweens.add({
            targets: this.block,
            duration: 1000,
            x: {from: 592, to: 398},
            repeat: -1
        })
    }

    playMusic () {
        if (this.theme) this.theme.stop()
        this.theme = this.sound.add("cellheart", {
            mute: false,
            volume: 1.5,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });
        this.theme.play();
    }

    showInstructions() {
        this.add.bitmapText(this.center_width, 400, "arcade", "Join components of the same color!!", 30).setOrigin(0.5);
        this.add.bitmapText(this.center_width, 500, "arcade", "Use ARROWS to move", 30).setOrigin(0.5);
        this.add.bitmapText(this.center_width, 550, "arcade", "SPACE for speed drop!", 30).setOrigin(0.5);
        // this.add.bitmapText(this.center_width, 500, "pixelFont", "SPACE: speed up", 30).setOrigin(0.5);
              this.space = this.add.bitmapText(this.center_width, 600, "arcade", "Press ENTER to start", 25).setOrigin(0.5);
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
}
