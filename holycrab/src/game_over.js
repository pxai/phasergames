import Phaser from "phaser";

export default class GameOver extends Phaser.Scene {
    constructor () {
        super({ key: "game_over" });
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;

        this.label = this.add.bitmapText(this.center_width, 50, "arcade", "GAME OVER", 70).setOrigin(0.5);
        this.label = this.add.bitmapText(this.center_width, 200, "arcade", "Points: " + this.registry.get("score"), 50).setOrigin(0.5);
        this.shit = this.add.bitmapText(this.center_width, 300, "arcade", "Finally, both crabs were free!!", 30).setOrigin(0.5);
        this.add.image(this.center_width - 24, 400, "crab").setOrigin(0.5);
        this.add.image(this.center_width + 24, 400, "crab2").setOrigin(0.5);
        this.dynamic = this.add.bitmapText(this.center_width, this.height - 150, "arcade", "Press ENTER/Click mouse to try again", 30).setOrigin(0.5);
        this.input.on('pointerdown', (pointer) => this.startGame(), this);
        this.tweens.add({
            targets: this.dynamic,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
        this.playMusic();
        this.input.keyboard.on("keydown-ENTER", () => this.startGame(), this);
    }

    startGame () {
        this.theme.stop();
        this.scene.start("splash");
    }

    playMusic () {
        if (this.theme) this.theme.stop()
        this.theme = this.sound.add("music3", {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });
        this.theme.play()
    }
}
