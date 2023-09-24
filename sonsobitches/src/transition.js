import {readData, saveData } from "./store";

export default class Transition extends Phaser.Scene {
    constructor () {
        super({ key: "transition" });
    }

    init (data) {
        this.name = data.name;
        this.number = data.number;
        this.next = data.next;
    }

    preload () {
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.shellLogo1 = this.add.sprite(50, 75, "shell").setScale(1.3).setOrigin(0.5).setScrollFactor(0)
        this.add.bitmapText(this.center_width,70, "default", "SCOREBOARD", 60).setTint(0xE67A32).setOrigin(0.5).setDropShadow(1, -2, 0xf0d54a, 0.9);
        this.shellLogo2 = this.add.sprite(this.width - 60, 75, "shell").setScale(1.3).setOrigin(0.5).setScrollFactor(0)
        this.restartText = this.add.bitmapText(this.center_width, 570, "default", "Press SPACE to start", 30).setOrigin(0.5).setDropShadow(1, -2, 0xf0d54a, 0.9)

        this.anims.create({
            key: "shell",
            frames:  this.anims.generateFrameNumbers("shell", { start: 0, end: 5 }),
            frameRate: 5,
            repeat: -1
        });

        this.shellLogo1.anims.play("shell", true);
        this.shellLogo2.anims.play("shell", true);
        this.tweens.add({
            targets: [this.shellLogo1, this.shellLogo2],
            duration: 500,
            y: "-=10",
            repeat: -1,
            yoyo: true
        })

        this.restartText.setInteractive();
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
        this.restartText.on('pointerdown', (pointer) => this.loadNext(), this);
        this.loadScores();
        this.input.keyboard.on("keydown-ENTER", () => this.loadNext(), this);
    }

    update () {
    }

    loadNext () {
        this.scene.start("game", { name: this.name, number: this.number });
    }

    async loadScores () {
        const scores = await readData();
        const ballBreakerScores = scores.filter(score => score.game === "SonsoBitches")
        ballBreakerScores.sort((a, b) => b.score - a.score);

        let amongFirst10 = false;

        ballBreakerScores.splice(0, 10).forEach( (score, i) => {
            const text0 = this.add.bitmapText(this.center_width - 350, 170 + (i * 30), "default", `${i+1}`, 20).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
            const text1 = this.add.bitmapText(this.center_width - 150, 170 + (i * 30), "default", `${score.player.substring(0, 10).padEnd(11, ' ')}`, 20).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
            const text2 = this.add.bitmapText(this.center_width + 200, 170 + (i * 30), "default", `${String(score.score).padStart(10, '0')}`, 20).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);

            if (score.id === this.currentId) {

                amongFirst10 = true;
                this.tweens.add({
                    targets: [text0, text1, text2],
                    duration: 300,
                    alpha: {from: 0, to: 1},
                    repeat: -1,
                    yoyo: true
                })
            }
        })
    }
}
