import Phaser from "phaser";

export default class Splash extends Phaser.Scene {
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

        this.label = this.add.bitmapText(this.center_width, this.center_height, "arcade", "GAME OVER", 50).setOrigin(0.5);
        this.label = this.add.bitmapText(this.center_width, this.center_height + 100, "arcade", "Time: " + this.registry.get("time"), 50).setOrigin(0.5);
        this.label = this.add.bitmapText(this.center_width, this.center_height + 200, "arcade", "Points: " + this.registry.get("score"), 50).setOrigin(0.5);
        this.dynamic = this.add.bitmapText(this.center_width, this.height - 150, "arcade", "Press ENTER to try again", 20).setOrigin(0.5);
        this.input.keyboard.on("keydown-ENTER", () => this.startGame(), this);
    }

    startGame () {
        // this.theme.stop();
        this.scene.start("game");
    }

    playMusic () {
        if (this.theme) this.theme.stop()
        this.theme = this.sound.add("music", {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });
        this.sound.play("music");
    }
}
