import {readData, saveData } from "./store";
import Sky from "./sky";
import Key from "./key";

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
        this.cloudLayer = this.add.layer();    
        await this.saveScore();
        //
        this.add.bitmapText(this.center_width,70, "daydream", "SCOREBOARD", 60).setOrigin(0.5).setDropShadow(0, 8, 0x222222, 0.9);
        this.restartText = this.add.bitmapText(this.center_width, 760, "daydream", "Click HERE to Restart", 20).setOrigin(0.5).setDropShadow(0, 8, 0x222222, 0.9);
        this.restartText.setInteractive();
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
        this.restartText.on('pointerdown', (pointer) => this.loadNext(), this);
        this.addSky();
        this.tweens.add({
            targets: this.restartText,
            duration: 300,
            alpha: {from: 0, to: 1},
            repeat: -1,
            yoyo: true
        });
    }

    addSky() {
        this.sky = new Sky(this);
    }

    update () {
    }

    async saveScore () {
        this.currentId = 0;
        const hits = +this.registry.get("hits");
        if (hits === 0) return;
        const notBigger = await this.notBigger(hits)
        if (notBigger) {
            await this.loadScores();
            return;
        }

        this.showPrompt();
    }

    showPrompt () {
        this.prompt = this.add.layer();
        this.userName = "";
        this.userNameText = this.add.bitmapText(this.center_width, this.center_height - 150, "daydream", this.userName.padEnd(9, '-'), 50).setTint(0xb95e00).setOrigin(0.5).setDropShadow(0, 8, 0x222222, 0.9);
        this.prompt.add(this.userNameText)
        this.addLetters()
    }

    async saveScoreWithName () {
        this.prompt.destroy();
        try {
            this.userName = this.userName.trim() || 'ANONYMOUS';
        } catch (er) {

        }

        this.currentId = await saveData(+this.registry.get("hits"), this.userName)
        await this.loadScores();
    }

    async notBigger (score) {
        try {
            const scores = await readData();
            const ballBreakerScores = scores.filter(score => score.game === "BallBreaker")
            ballBreakerScores.sort((a, b) => a.score - b.score).splice(0, 10);

            return ballBreakerScores.length >= 10 && ballBreakerScores.every(s => s.score < score)
        } catch (err) {
            console.log("Error checking date: ", err)
        }
        return true;
    }

    async loadScores () {
        const scores = await readData();
        const ballBreakerScores = scores.filter(score => score.game === "BallBreaker")
        ballBreakerScores.sort((a, b) => a.score - b.score);

        let amongFirst10 = false;

        ballBreakerScores.splice(0, 10).forEach( (score, i) => {
            const text0 = this.add.bitmapText(this.center_width - 350, 170 + (i * 60), "daydream", `${i+1}`, 30).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
            const text1 = this.add.bitmapText(this.center_width - 150, 170 + (i * 60), "daydream", `${score.player.substring(0, 10).padEnd(11, ' ')}`, 30).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
            const text2 = this.add.bitmapText(this.center_width + 200, 170 + (i * 60), "daydream", `${String(score.score).padStart(10, '0')}`, 30).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
            
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

    loadNext () {
        this.game.sound.stopAll();
        this.registry.set("hits", 0);
        this.scene.start("splash");
    }

    clickedLetter(letter) {
        console.log(letter, this.userName)
        if (this.userName.length < 9) {
            this.userName += letter;
            this.userNameText.setText(this.userName.padEnd(9, '-'));
        }
    }

    deleteName () {
        this.userName = "";
        this.userNameText.setText(this.userName.padEnd(9, '-'));
    }

    addLetters () {
        const alphabet = "qwertyuiop-asdfghjklñ-zxcvbnm";
        this.keyboard = {};
        let stepY = 0;
        let stepX = 64;
        let x = -32;
        let y = 0;
       // this.add.rectangle(250, 740, 500, 200, 0x4d4d4d).setOrigin(0.5);
        alphabet.split("").forEach((letter, i) => {
          const isDash = letter === "-";
          x = stepX ;
          stepY += isDash ? 64 : 0 
          stepX = isDash ? 64 : stepX + 64;
          y = 440 + stepY;
  
          if (isDash) return;
  
          const key = new Key(this, x, y, letter, this.clickedLetter.bind(this))
          this.prompt.add(key)
          this.keyboard[letter] = key;
        })
  
        this.keyboard["ok"] = new Key(this, x + 96, y, "ok", this.saveScoreWithName.bind(this));
        this.prompt.add(this.keyboard["ok"])
        this.keyboard["--"] = new Key(this, x + 192, y, "--", this.deleteName.bind(this));
        this.prompt.add(this.keyboard["--"])
        this.helpText = this.add.bitmapText(this.center_width, 630, "daydream", "", 30).setTint(0x4d4d4d).setOrigin(0.5)
      }
}
