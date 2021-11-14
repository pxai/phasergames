import Phaser from "phaser";
import Seagull from "./seagull";

export default class Splash extends Phaser.Scene {
    constructor () {
        super({ key: "splash" });
    }

    preload () {
        this.registry.set("score", 0);
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(0x3E6875);
        this.title = this.add.bitmapText(this.center_width, 250, "arcade", "Holy Crab!", 114).setOrigin(0.5);
        this.startTween()
        this.input.keyboard.on("keydown-ENTER", () => this.startGame(), this);
        this.input.on('pointerdown', (pointer) => this.startGame(), this);
       // this.playMusic();
        this.playBackground();
        this.showInstructions();
        this.timer = this.time.addEvent({ delay: 2000, callback: this.generateSeagulls, callbackScope: this, loop: true });
  
    }

    startTween () {
        this.tweens.add({
            targets: this.title,
            duration: 400,
            scale: {from: 0.99, to: 1},
            repeat: -1,
            yoyo: true
        });
    }
    startGame () {
        //this.theme.stop();
        this.timer.remove();
        this.scene.start("transition", {next: "stage1", name: "STAGE"});
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

    playBackground() {
        if (this.background) this.background.stop()
        this.background = this.sound.add("background", {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });
        this.background.play()
    }

    showInstructions() {
        this.add.bitmapText(this.center_width, 500, "arcade", "Crab to the rescue", 30).setOrigin(0.5);
        this.add.image(this.center_width - 24, 550, "crab").setOrigin(0.5);
        this.add.image(this.center_width + 24, 550, "crab2").setOrigin(0.5);
        this.add.bitmapText(this.center_width, 600, "arcade", "Use your mouse!", 30).setOrigin(0.5);
        this.space = this.add.bitmapText(this.center_width, 680, "arcade", "Press ENTER/Click mouse to start", 25).setOrigin(0.5);
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

    generateSeagulls () {
        new Seagull(this, 900, Phaser.Math.Between(20, 800));
        new Seagull(this, 900, Phaser.Math.Between(20, 800));
        new Seagull(this, -50, Phaser.Math.Between(20, 800), 1);
     }
}
