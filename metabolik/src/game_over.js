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

        this.label = this.add.bitmapText(this.center_width, this.center_height - 200, "arcade", "GAME OVER", 70).setOrigin(0.5);
        this.labelTime = this.add.bitmapText(this.center_width, this.center_height - 100, "arcade", "Time: " + this.registry.get("time"), 50).setOrigin(0.5);
        this.labelHealth = this.add.bitmapText(this.center_width, this.center_height, "arcade", "Empty cells: " + this.registry.get("health"), 50).setOrigin(0.5);
        this.labelPoints = this.add.bitmapText(this.center_width, this.center_height + 100, "arcade", "Points: " + this.registry.get("score"), 50).setOrigin(0.5);
        this.shit = this.add.bitmapText(this.center_width, this.height - 200, "arcade", "Yeah, you need more of this shit so...", 30).setOrigin(0.5);
        this.dynamic = this.add.bitmapText(this.center_width, this.height - 150, "arcade", "Press ENTER to try again", 30).setOrigin(0.5);
        this.tweens.add({
            targets: this.dynamic,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
        this.playMusic();
        this.updatePoints();
        this.coin = this.sound.add("coin");
        this.bonus = this.sound.add("bonus");
        this.input.keyboard.on("keydown-ENTER", () => this.startGame(), this);
    }

    startGame () {
        clearInterval(this.countingId); 
        this.theme.stop();
        this.scene.start("game");
    }

    playMusic () {
        if (this.theme) this.theme.stop()
        this.theme = this.sound.add("cellheart", {
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

    updatePoints() {
        this.countingId = setInterval(() => this.increment(), 50)
    }

    increment () {
        let health = +this.registry.get("health")
        let score = +this.registry.get("score")

        if (health === 0) { 
            clearInterval(this.countingId);
            this.bonus.play();
            this.tweens.add({
                targets: this.labelPoints,
                duration: 300,
                alpha: {from: 0, to: 1},
                repeat: -1,
                yoyo: true
            });
            return; 
        }
        let minus = health >= 10 ? 10 : 1;
        health -= minus;
        score += 10 * minus;
        console.log(score, health)

        this.labelHealth.setText("Empty cells: " + health);
        this.labelPoints.setText("Points: " + score)
        this.coin.play();
        this.registry.set("score", `${score}`)
        this.registry.set("health", `${health}`)
    }
}
