import {readData, saveData } from "./store";
import Key from "./key";

export default class Scoreboard extends Phaser.Scene {
    constructor () {
        super({ key: "scoreboard" });
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
        this.cloudLayer = this.add.layer();    
        console.log("This scoreboard: ", this.number)
        if (this.number > 0)
            await this.saveScore();
        else
            await this.loadScores();
        //
        this.add.bitmapText(this.center_width,70, "mario", "SCOREBOARD", 60).setOrigin(0.5).setTint(0xb95e00).setDropShadow(3, 4, 0xfffd00, 0.7);;
        this.restartText = this.add.bitmapText(this.center_width, 550, "mario", "Continue", 20).setOrigin(0.5).setTint(0xb95e00).setDropShadow(1, 2, 0xfffd00, 0.7);
        this.restartText.setInteractive();
        this.input.keyboard.on("keydown-SPACE", () => this.loadNext(), this);
        this.restartText.on('pointerdown', (pointer) => this.loadNext(), this);
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
        this.playMusic();
        console.log("Should save score")
        this.currentId = 0;
        const hits = +this.registry.get("moves");
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
        this.userNameText = this.add.bitmapText(this.center_width - 250, this.center_height - 150, "mario", this.userName.padEnd(9, '-'), 50).setTint(0xb95e00).setDropShadow(3, 4, 0xfffd00, 0.7);
        this.prompt.add(this.userNameText)
        this.addLetters()
    }

    async saveScoreWithName () {
        this.prompt.destroy();
        try {
            this.userName = this.userName.trim() || 'ANONYMOUS';
        } catch (er) {

        }

        this.currentId = await saveData(+this.registry.get("moves"), this.userName)
        await this.loadScores();
    }

    async notBigger (score) {
        try {
            const scores = await readData();
            const PowerGridScores = scores.filter(score => score.game === "PowerGrid")
            PowerGridScores.sort((a, b) => a.score - b.score).splice(0, 10);

            return PowerGridScores.length >= 10 && PowerGridScores.every(s => s.score < score)
        } catch (err) {
            console.log("Error checking date: ", err)
        }
        return true;
    }

    async loadScores () {
        console.log("Ready to read")
        const scores = await readData();
        const PowerGridScores = scores.filter(score => score.game === "PowerGrid")
        PowerGridScores.sort((a, b) => a.score - b.score);

        let amongFirst10 = false;
        console.log("Scores: ", PowerGridScores.length)
        PowerGridScores.splice(0, 10).forEach( (score, i) => {
            const text0 = this.add.bitmapText(this.center_width - 350, 170 + (i * 60), "mario", `${i+1}`, 30).setOrigin(0.5).setTint(0xb95e00).setDropShadow(1, 2, 0xfffd00, 0.7);
            const text1 = this.add.bitmapText(this.center_width - 150, 170 + (i * 60), "mario", `${score.player.substring(0, 10).padEnd(11, ' ')}`, 30).setOrigin(0.5).setTint(0xb95e00).setDropShadow(1, 2, 0xfffd00, 0.7)
            const text2 = this.add.bitmapText(this.center_width + 200, 170 + (i * 60), "mario", `${String(score.score).padStart(10, '0')}`, 30).setOrigin(0.5).setTint(0xb95e00).setDropShadow(1, 2, 0xfffd00, 0.7)
            
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

    playMusic (theme="transition") {
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
        this.registry.set("moves", 0);

        if (this.number > 0)
            this.scene.start("splash");
        else
            this.scene.start("transition", {name: "STAGE", number: 0})
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
        let stepX = 48;
        let x = -32;
        let y = 0;
       // this.add.rectangle(250, 740, 500, 200, 0x4d4d4d).setOrigin(0.5);
        alphabet.split("").forEach((letter, i) => {
          const isDash = letter === "-";
          x = stepX ;
          stepY += isDash ? 48 : 0 
          stepX = isDash ? 48 : stepX + 48;
          y = 280 + stepY;
  
          if (isDash) return;
  
          const key = new Key(this, x, y, letter, this.clickedLetter.bind(this))
          this.prompt.add(key)
          this.keyboard[letter] = key;
        })
  
        this.keyboard["ok"] = new Key(this, x + 96, y, "ok", this.saveScoreWithName.bind(this));
        this.prompt.add(this.keyboard["ok"])
        this.keyboard["--"] = new Key(this, x + 192, y, "--", this.deleteName.bind(this));
        this.prompt.add(this.keyboard["--"])
        this.helpText = this.add.bitmapText(this.center_width, 500, "mario", "To enter your name just \nClick on letters and press OK", 15).setOrigin(0.5).setTint(0xb95e00).setDropShadow(1, 2, 0xfffd00, 0.7)
      }
}
