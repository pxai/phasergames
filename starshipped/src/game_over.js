import Phaser from "phaser";

export default class Splash extends Phaser.Scene {
    constructor () {
        super({ key: "game-over" });
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;

        this.showScore();
        this.label = this.add.bitmapText(this.center_width, this.center_height - 300, "starshipped", "GAME OVER", 100).setOrigin(0.5);
        this.shit = this.add.bitmapText(this.center_width, this.center_height + 300, "starshipped", "Yeah, you need more of this shit so...", 30).setOrigin(0.5);
        this.dynamic = this.add.bitmapText(this.center_width, this.center_height + 350, "starshipped", "Press ENTER to try again", 30).setOrigin(0.5);
        this.tweens.add({
            targets: this.dynamic,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
        this.playMusic();
        this.registry.set("playerScore", "0");
        this.registry.set("foeScore", "0");
        this.input.keyboard.on("keydown-ENTER", () => this.startGame(), this);
    }

    startGame () {
        this.theme.stop();
        this.scene.start("game");
    }

    playMusic () {
        if (this.theme) this.theme.stop()
        this.theme = this.sound.add("game-over", {
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

    showScore () {
        let playerScore = +this.registry.get("playerScore");
        let foeScore = +this.registry.get("foeScore");
        let outcome = "";
        if (playerScore > foeScore) {
            outcome = ["You won!!", "YAY!!", "Awesome!!", "Amazing!!", "Yeah!", "You rule!!"][Phaser.Math.Between(0, 5)];
        } else {
            outcome = ["You lost!!", "You suck!!", "Loser!!", "Still live with mom?", "Boo!!", "Yikes!!", "LOL!!"][Phaser.Math.Between(0, 6)];
            this.registry.set("foeScore",`${foeScore}`)
        }

        const x = this.center_width;
        const y = this.center_height;
        this.score1 = this.add.bitmapText(x, y - 100, "starshipped", outcome, 80).setOrigin(0.5);
        this.score2 = this.add.bitmapText(x, y + 100, "starshipped", `You: ${playerScore} - Foe: ${foeScore}`, 60).setOrigin(0.5);
    }
}
