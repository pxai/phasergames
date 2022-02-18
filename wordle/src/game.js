import Key from "./key";
import Step from "./step";
import Wordle from "./wordle";
import Penguin from "./penguin";
import getParameters from "./get_params";
import words from "./words";


export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }

    init (data) {
      this.name = data.name;
      this.number = data.number;
  }

    preload () {
    }

    create () {
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      this.add.tileSprite(0, 0, 1800, 1800, "background").setOrigin(0.5);
      this.cameras.main.setBackgroundColor(0xffffff);

      this.loadWord();

      this.wordle = new Wordle(this.wordToGuess)
      this.guess = "";
      this.enabled = true;
      
      this.addTitle();
      this.addSteps();
      this.addWalls();
      this.addPenguin();
      this.addLetters();
      this.addResult();

      this.loadAudios(); 
      // this.playMusic();
    }

    loadWord () {
      const lang = getParameters().get("lang") || "en";
      const today = `${new Date().getFullYear()}-${("0" + (new Date().getMonth()+1)).slice(-2)}-${("0" + new Date().getDate()).slice(-2)}`;
      console.log("Loading ", lang, today)
      this.wordToGuess = words[lang][today];
    }

    addTitle() {
      this.add.bitmapText(this.center_width, 40, "pixelFont", "WORDLE", 40).setOrigin(0.5).setDropShadow(3, 4, 0x222222, 0.7);
    }

    addWalls() {
      for (let i = 0; i < 16; i++) {
        this.add.sprite(30, i * 64, "block" + Phaser.Math.Between(0, 1));
        this.add.sprite(468, i * 64, "block" + Phaser.Math.Between(0, 1));
      }
    }
      loadAudios () {
        this.audios = {
          "match": this.sound.add("match"),
          "fail": this.sound.add("fail"),
          "almost": this.sound.add("almost"),
          "key": this.sound.add("key"),
          "over": this.sound.add("over"),
          "victory": this.sound.add("victory"),
          "defeat": this.sound.add("defeat"),
        };

        this.colorKeys = {
          0xcccccc: "fail",
          0xffa500: "almost",
          0x00ff00: "match"
        };
      }

      playAudio(key) {
        this.audios[key].play();
      }

      playMusic (theme="game") {
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

    update() {
      this.penguin.update();
    }

    addPenguin () {
      this.penguin = new Penguin(this, 112, 76)
    }

    addSteps () {
      const alphabet = "qwertyuiop-asdfghjklñ-zxcvbnm";
      this.steps = [];
      let stepY = 0;
      let stepX = 56;
      let x = 56;
      let y = 100;

      Array(6).fill(0).forEach((letter, i) => {
        this.steps.push([])
        Array(5).fill(0).forEach((_, j) => {
          const step = new Step(this, x, y)
          this.steps[i].push(step);
          x += 64;
        })
        x = 56;
        y += 64;
      })
    }


    addLetters () {
      const alphabet = "qwertyuiop-asdfghjklñ-zxcvbnm";
      this.keyboard = {};
      let stepY = 0;
      let stepX = -32;
      let x = -32;
      let y = 0;
      this.add.rectangle(250, 740, 500, 200, 0x4d4d4d).setOrigin(0.5);
      alphabet.split("").forEach((letter, i) => {
        const isDash = letter === "-";
        x = stepX ;
        stepY += isDash ? 48 : 0 
        stepX = isDash ? -32 : stepX + 48;
        y = 640 + stepY;

        if (isDash) return;

        const key = new Key(this, x, y, letter)
        this.keyboard[letter] = key;
      })

      this.keyboard["ok"] = new Key(this, x + 48, y, "ok");
      this.keyboard["-"] = new Key(this, x + 96, y, "-");
      this.keyboard["--"] = new Key(this, x + 144, y, "--");
      this.helpText = this.add.bitmapText(this.center_width, 630, "font2", "", 30).setTint(0x4d4d4d).setOrigin(0.5)
    }

    addResult () {
      this.resultText = this.add.bitmapText(this.center_width, 580, "font2", "", 40).setTint(0x000000).setOrigin(0.5)
    }

    finishScene () {
      this.sky.stop();
      this.theme.stop();
      this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1});
    }

    showResult (points = 0) {
      if (this.wordle.outcome === "lose") {
        this.showAnswer();
        return;
      } 

      this.penguin.play("playerjump", true)
      this.playAudio("victory")
      this.resultText.setText(this.wordle.outcome).setAlpha(1).setTint(0xffffff).setScale(2).setDropShadow(3, 4, 0x222222, 0.7);
      this.tweens.add({
        targets: this.resultText,
        scale: { from : 2, to: 3},
        repeat: -1,
        duration: 500,
        yoyo: true
      })
    }

    showAnswer() {
      Array(5).fill(0).forEach((_, i) => {
        new Step(this, 56 + (64 * i), 540, this.wordle.word.charAt(i));
      })
      this.playAudio("defeat")
      this.penguin.y = 514;
      this.penguin.anims.play("playerground", true);
    }
  
  setHelpText (letter) {
    const help = {
      "ok": "Enter",
      "-": "Delete last",
      "--": "Delete all"
    }[letter] || letter;
    this.helpText.setText(help) 
  }

    clickedLetter (letter) {
      const allowed = "abcdefghijklmnñopqrstuvwxyz";

      if (allowed.indexOf(letter) >= 0 && this.guess.length < 5 && this.enabled) {
        this.guess += letter;
        this.steps[this.wordle.current][this.guess.length - 1].setLetter(letter);
      } else if (letter === "ok" && this.guess.length === 5) {
        this.guessLine();
      } else if (letter === "-") {
        this.deleteOne();
      } else if (letter === "--") {
        this.deleteAll();
      }
    }

    guessLine() {
      this.wordle.guess(this.guess);
      this.updateSteps();
      this.wordle.next()
      this.guess = "";
      this.checkEnd();
    }

    checkEnd () {
      if (this.wordle.outcome !== "playing") {
        this.enabled = false;
        this.time.delayedCall(1600 , () => { this.showResult(); }, null, this);
      }
    }

    updateSteps () {
      const status = this.wordle.currentStatus();
      this.steps[this.wordle.current].forEach((step,i) => {
        this.time.delayedCall(400 * i, () => {
          step.setColor(status[i].color);
          this.keyboard[status[i].letter].setColor(status[i].color);
          this.playAudio(this.colorKeys[status[i].color]);
        }, null, this);
      });
    }


    deleteOne () {
      this.guess = this.guess.substring(0, this.guess.length - 1)
      this.steps[this.wordle.current][this.guess.length].setLetter();
    }

    deleteAll () {
      this.guess = "";
      this.steps[this.wordle.current].forEach(text => {if (text) text.setLetter()});
    }
}
