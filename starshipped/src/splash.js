import Phaser from "phaser";
import Hex from "./hex";

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
 
        this.input.keyboard.on("keydown-ENTER", () => this.startGame(), this);
       // this.playMusic();
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
        // this.theme.stop();
        this.scene.start("game");
    }

    playMusic () {
        if (this.theme) this.theme.stop()
        this.theme = this.sound.add("splash", {
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

    addBackground () {
        /*Array(12).fill(0).forEach( (row, i) => {
            Array(5).fill(0).forEach( (e, j) => {
                this.createHexes(i, j)
            });
        });*/
        Array(3).fill(0).forEach( (e, i) => { this.createHexes(i, 0) });
        Array(8).fill(0).forEach( (e, i) => { this.createHexes(i, 1) });
        Array(12).fill(0).forEach( (e, i) => { this.createHexes(i, 2) });
        Array(13).fill(0).forEach( (e, i) => { this.createHexes(i, 3) });
        Array(8).fill(0).forEach( (e, i) => { this.createHexes(i + 4, 4) });
        Array(5).fill(0).forEach( (e, i) => { this.createHexes(i + 6, 5) });
    }

    createHexes (i, j) {
        let offset = j % 2 === 0 ?  32 : 0; 
        let shadow = new Hex(this, 67 + (i * 64) + offset + 4, 150 + ( j * 55) + 4, false).setTint(0x292C47)
        new Hex(this, 64 + (i * 64) + offset, 150 + ( j * 55))
    }
}
