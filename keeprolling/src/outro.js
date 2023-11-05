import { readData, saveData } from "./store";
import Key from "./key";
export default class Outro extends Phaser.Scene {
    constructor () {
        super({ key: "outro" });
    }

    preload () {
    }

    async create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.introLayer = this.add.layer();
        this.splashLayer = this.add.layer();
        this.helpText = this.add.bitmapText(this.center_width, 32, "default", "SCOREBOARD", 50).setTint(0x618fc0).setOrigin(0.5)
        await this.saveScore();
        //this.showPlayer();
        //this.playMusic();
        this.input.keyboard.on("keydown-SPACE", this.startSplash, this);
        this.input.keyboard.on("keydown-ENTER", this.startSplash, this);
    }

    showHistory () {
        this.text.forEach((line, i) => {
                this.time.delayedCall((i + 1) * 2000, () => this.showLine(line, (i + 1) * 60), null, this); 
        });
        this.time.delayedCall(4000, () => this.showPlayer(), null, this); 
    }

    playMusic (theme="outro") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 1,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
    }

    startSplash () {
        // this.theme.stop();
        this.scene.start("splash");
    }

    showPrompt () {
        this.prompt = this.add.layer();
        this.userName = "";
        this.userNameText = this.add.bitmapText(this.center_width, this.center_height - 150, "default", this.userName.padEnd(9, '-'), 50).setTint(0xffffff).setOrigin(0.5).setDropShadow(0, 8, 0x618fc0, 0.9);
        this.prompt.add(this.userNameText)
        this.addLetters()
    }

    async saveScoreWithName () {
        this.prompt.destroy();
        try {
            this.userName = this.userName.trim() || 'ANONYMOUS';
        } catch (er) {

        }

        this.currentId = await saveData(+this.registry.get("points"), this.userName)
        await this.loadScores();
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
        this.helpText = this.add.bitmapText(this.center_width, 640, "default", "Click on chars to save your name!", 30).setTint(0x4d4d4d).setOrigin(0.5)
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

    async notBigger (score) {
        try {
            const scores = await readData();
            const makeWayScores = scores.filter(score => score.game === "KeepRolling").sort((a, b) => b.score - a.score).splice(0, 10);

            return makeWayScores.length >= 10 && makeWayScores.every(s => s.score > score)
        } catch (err) {
            console.log("Error checking date: ", err)
        }
        return true;
    }

    async loadScores () {
        const scores = await readData();
        const makeWayScores = scores.filter(score => score.game === "KeepRolling").sort((a, b) => b.score - a.score);
        let amongFirst10 = false;

        makeWayScores.splice(0, 10).forEach( (score, i) => {
            const text0 = this.add.bitmapText(this.center_width - 350, 170 + (i * 60), "default", `${i+1}`, 60).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
            const text1 = this.add.bitmapText(this.center_width - 150, 170 + (i * 60), "default", `${score.player.substring(0, 10).padEnd(11, ' ')}`, 60).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
            const text2 = this.add.bitmapText(this.center_width + 200, 170 + (i * 60), "default", `${String(score.score).padStart(10, '0')}`, 60).setOrigin(0.5).setDropShadow(0, 6, 0x222222, 0.9);
            
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
