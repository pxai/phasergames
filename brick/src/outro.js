import {readData, saveData } from "./store";

export default class Outro extends Phaser.Scene {
    constructor () {
        super({ key: "outro" });
    }

    init (data) {
        this.name = data.name;
        this.number = data.number;
        this.next = data.next;
    }

    preload () {
    }

    async create () {

        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(0x006fb1) 
        await this.saveScore();
        await this.loadScores();
        this.add.bitmapText(this.center_width,70, "mario", "SCOREBOARD", 60).setOrigin(0.5).setDropShadow(0, 8, 0x222222, 0.9);
        this.restartText = this.add.bitmapText(this.center_width, 760, "mario", "Click to Restart", 20).setOrigin(0.5).setDropShadow(0, 8, 0x222222, 0.9);
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
        this.input.on('pointerdown', (pointer) => this.loadNext(), this);
        this.tweens.add({
            targets: this.restartText,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }

    update () {
    }

    async saveScore () {
        this.currentId = 0;
        const notBigger = await this.notBigger(+this.registry.get("hits"))
        if (notBigger) return;
        const name = window.prompt("Congrats! Enter your name:")

        this.userName = 'ANONYMOUS';
        try {
            this.userName = name.trim() || 'ANONYMOUS';
        } catch (er) {

        }

        this.currentId = await saveData(+this.registry.get("hits"), this.userName)
    }

    async notBigger (score) {
        try {
            const scores = await readData();
            const ballBreakerScores = scores.filter(score => score.game === "Bricks")
            ballBreakerScores.sort((a, b) => a.score - b.score).splice(0, 10);

            return ballBreakerScores.length >= 10 && ballBreakerScores.every(s => s.score < score)
        } catch (err) {
            console.log("Error checking date: ", err)
        }
        return true;
    }

    async loadScores () {
        const scores = await readData();
        const ballBreakerScores = scores.filter(score => score.game === "Bricks")
        ballBreakerScores.sort((a, b) => a.score - b.score);

        let amongFirst10 = false;

        ballBreakerScores.splice(0, 10).forEach( (score, i) => {
            const text0 = this.add.bitmapText(this.center_width - 350, 170 + (i * 60), "mario", `${i+1}`, 30).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
            const text1 = this.add.bitmapText(this.center_width - 150, 170 + (i * 60), "mario", `${score.player.substring(0, 10).padEnd(11, ' ')}`, 30).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
            const text2 = this.add.bitmapText(this.center_width + 200, 170 + (i * 60), "mario", `${String(score.score).padStart(10, '0')}`, 30).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
            
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

    playMusic (theme="outro") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 0.5,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
      }

    loadNext () {
        this.game.sound.stopAll();
        this.registry.set("hits", 0);
        this.scene.start("splash");
    }
}
