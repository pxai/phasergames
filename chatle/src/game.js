import Key from "./key";
import Step from "./step";
import Wordle from "./wordle";
import Penguin from "./penguin";
import Word from "./word";
import Chat from "./chat";
import Player from "./player";


export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }

    init (data) {
      this.dictionary = data.dictionary;
      this.lang = data.lang;
    }

    preload () {
      const urlParams = new URLSearchParams(window.location.search);

      let parambg = urlParams.get('background') || "#00b140";
      parambg = parseInt(parambg.substring(1), 16)
      this.backgroundColor = '0x' + parambg.toString(16)

      this.strict = urlParams.get('mode') === "strict";

      this.spamTimeWait = 2;

      this.chained = false;
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
      this.word = new Word(this.dictionary);
      this.userGuess = "";
      this.guessingUser = "";
      this.enabled = true;
      this.locked = false;
      this.addTitle();
      this.addSteps();
      this.addWalls();
      this.addPenguin();
     // this.addLetters();
      this.addResult();

      this.loadAudios();
      // this.playMusic();
      this.addChat();
    }

    addChat () {
        this.allPlayers = {};
        this.chat = new Chat(this);
    }

    loadWord () {
      this.wordToGuess = this.dictionary.randomWord();
    }

    addTitle() {
      this.add.bitmapText(this.center_width, 20, "mainFont", "CHATLE", 45).setOrigin(0.5).setDropShadow(3, 4, 0x222222, 0.7);
      this.add.bitmapText(this.center_width, 60, "mainFont", "by Pello", 10).setOrigin(0.5).setDropShadow(1, 1, 0x222222, 0.7);
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

    addResult () {
      this.resultText = this.add.bitmapText(this.center_width, 580, "mainFont", "", 40).setTint(0x000000).setOrigin(0.5)
    }

    finishScene () {
      this.sky.stop();
      this.theme.stop();
      this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1});
    }

    showResult (points = 0) {
      this.locked = true;
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
      this.winnerNameText = this.add.bitmapText(this.center_width, this.height - 128, "mainFont", this.guessingUser + " ftw!", 30).setOrigin(0.5).setTint(0x000000).setAlpha(1).setDropShadow(3, 4, 0x222222, 0.7);

      this.showRestart();
    }

    showAnswer() {
      Array(5).fill(0).forEach((_, i) => {
        new Step(this, 56 + (64 * i), 540, this.wordle.word.charAt(i));
      })
      this.playAudio("defeat")
      this.penguin.y = 514;
      this.penguin.anims.play("playerground", true);

      this.showRestart();
    }


    guessLine() {
      this.wordle.guess(this.userGuess);
      this.updateSteps();
      this.time.delayedCall(2000, () => {
        this.wordle.next()
        this.locked = false;
        this.checkEnd();
       }, null, this);
    }

    checkEnd () {
      if (this.wordle.outcome !== "playing") {
        this.enabled = false;
        this.time.delayedCall(1600 , () => { this.showResult();  }, null, this);
      }
    }

    updateSteps () {
      const status = this.wordle.currentStatus();
      let guessed = ""
      this.steps[this.wordle.current].forEach((step,i) => {
        this.time.delayedCall(400 * i, () => {
          step.setColor(status[i].color);
          this.steps[this.wordle.current][i].setLetter(this.userGuess.charAt(i));
          this.playAudio(this.colorKeys[status[i].color]);
        }, null, this);
      });
    }

    addPlayer (name) {
      if (this.allPlayers[name]) return this.allPlayers[name];
      const player = new Player(this, name);
      this.allPlayers[name] = player;
      this.chat.say(`Player ${name} joins game!`);
      return player;
  }

  guess (playerName, playerWord) {
    const player = this.addPlayer(playerName);
    if (this.word.isValid(playerWord, this.strict) && player.lastMessage !== playerWord && !this.locked) {
      console.log("Game> LETS GO: ", playerWord, " isValid ", this.word.isValid(playerWord, this.strict), " current: " , this.wordle.current)
        this.locked = true;
        this.userGuess = player.lastMessage = playerWord;
        this.guessingUser = playerName;
        this.guessLine()
    }
  }

  showRestart() {
    this.reloadText = this.add.bitmapText(this.center_width, this.height - 32, "mainFont", "RESTART", 20).setOrigin(0.5);
    this.reloadText.setInteractive();
    this.reloadText.on('pointerdown', () => {
        window.location.reload();
    });

    this.reloadText.on('pointerover', () => {
        this.reloadText.setTint(0x00ff00)
    });

    this.reloadText.on('pointerout', () => {
        this.reloadText.clearTint()
    });

    this.timeCount = 10;
    this.timeCountTextText = this.add.bitmapText(this.center_width, this.height - 16, "mainFont", this.timeCount, 15).setOrigin(0.5);

    this.time.delayedCall(10000, () => {
       window.location.reload();
    }, null, this);

    this.time.addEvent({
      delay: 1000,
      callback: () => {
          this.timeCountTextText.setText("" + this.timeCount);
          this.timeCount--;
          if (this.timeCount === 0) {
            window.location.reload();
          }
      },
      callbackScope: this,
      loop: true
    });
  }
}
