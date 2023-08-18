import Player from "./player";
import Chat from "./chat";
import RomanNumbers from "./roman_numbers";

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
        this.nextOperator = "";
        this.lastMessage = null;
        this.number = "";
        this.counter = 0;
        this.failed = false;
    }

    init () {
    }

    preload () {
        const urlParams = new URLSearchParams(window.location.search);
        let parambg = urlParams.get('background') || "#00b140";
        parambg = parseInt(parambg.substring(1), 16)
        this.backgroundColor = '0x' + parambg.toString(16)

        let paramRectangle = urlParams.get('rectangle') || "#F0EAD6";
        paramRectangle = parseInt(paramRectangle.substring(1), 16)
        this.rectangleColor = '0x' + paramRectangle.toString(16)

        let paramNumbers = urlParams.get('numbers') || "#f22c2e";
        paramNumbers = parseInt(paramNumbers.substring(1), 16)
        this.numbersColor = '0x' + paramNumbers.toString(16)
        this.highestScore = 1;
        this.hightestScorePlayer = "Pello";
        this.spamTimeWait = 2;
        this.lastWinningPlayer = "Pello";

        this.textColor = 0xFEE24E;
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(+this.rectangleColor);
        this.romanNumbers = new RomanNumbers();
        this.current = this.result = this.romanNumbers.generateNext();
        console.log("Current: ", this.current);
        this.cursor = this.input.keyboard.createCursorKeys();
        this.allPlayers = {};
        this.addChat();
        this.loadAudios();
        this.addUI();
        this.generateNextOperation();
    }

    loadGame() {

    }

    addChat () {
        this.chat = new Chat(this);
    }

    addUI () {
        this.rectangleBack = this.add.rectangle(this.center_width, this.center_height + 8, this.width - 16, (this.height/2) + 8, 0x000000).setAlpha(0.5);
        this.rectangle = this.add.rectangle(this.center_width, this.center_height, this.width - 16, this.height/2, this.numbersColor);
        this.numberText = this.add.bitmapText(this.center_width, this.center_height - 5, "mainFont", this.current, 90).setOrigin(0.5).setTint(this.rectangleColor)
        this.addScore();
    }

    addScore () {
        const scoreBoard = this.createScoreBoard()

        this.hightScoreText1 = this.add.bitmapText(this.center_width, 16, "mainFont", "Maximum punctum: " + this.highestScore, 20).setOrigin(0.5).setTint(this.textColor).setDropShadow(1, 1, 0xffffff, 0.7);
        this.hightScoreText2 = this.add.bitmapText(this.center_width, 36, "mainFont", this.hightestScorePlayer , 25).setOrigin(0.5).setTint(0xffffff).setDropShadow(1, 1, 0xffffff, 0.7);

        this.scoreText1 = this.add.bitmapText(this.center_width, this.height - 64, "mainFont", "", 30).setOrigin(0.5).setTint(this.textColor).setDropShadow(1, 1, 0xffffff, 0.7);
        this.scoreText2 = this.add.bitmapText(this.center_width, this.height - 32, "mainFont", "", 35).setOrigin(0.5).setTint(this.textColor).setDropShadow(1, 1, 0xffffff, 0.7);
    }


    addPlayer (name) {
        if (this.allPlayers[name]) return this.allPlayers[name];
        const player = new Player(this, name);
        this.allPlayers[name] = player;
        this.chat.say(`Player ${name} joins game!`);
        return player;
    }

    guess (playerName, letters) {
        if (this.failed) return;
        console.log("Game> guess: ", playerName, letters)

        const player = this.addPlayer(playerName);
        //if (player.dead) return;
        if (this.lastWinningPlayer === playerName) { console.log("You cant repeat"); return;}
        //if (player.hasSpammed()) return;
        player.lastMessage = new Date();

        console.log("Game> guess go on: ", playerName, letters)

        if (this.result === letters) {
            player.score = this.counter;
            this.showScore(playerName, player.score);
            this.generateNextOperation();
            this.showAnimation();
            this.scoreText2.setText(`${playerName}`).setAlpha(1);
            console.log("Player", playerName, "guess", letters);
            this.lastWinningPlayer = playerName;
        } else {
            this.cameras.main.shake(100, 0.01);
            this.playAudio("fail");
            this.failed = true;
            player.setPenalty()
            this.showShame(playerName);
            this.chat.say(`Player ${playerName} failed! Shame on you!`);
        }
    }

    showAnimation() {
        if (this.buttonTween && this.buttonTween.isPlaying()) { return; }

        this.buttonTween = this.tweens.add({
            targets: [this.rectangle, this.numberText],
            y: "+=8",
            duration: 150,
            yoyo: true,
        });
    }


    calculateScore () {
       return this.counter;
    }

    isValidNumber (number) {
        return !isNaN(number) && number >= 0 && number < this.width;
    }

    loadAudios () {
        this.audios = {
            win: this.sound.add("win"),
            drip: this.sound.add("drip"),
            fail: this.sound.add("fail")
        };
    }

    playAudio (key) {
        this.audios[key].play({
            volume: 0.5,
        });
    }

    playRandom(key) {
        this.audios[key].play({
          rate: Phaser.Math.Between(1, 1.5),
          detune: Phaser.Math.Between(-1000, 1000),
          delay: 0
        });
      }

    playMusic (theme = "game") {
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
        });
    }

    update () {
        // if (Phaser.Input.Keyboard.JustDown(this.cursor.down)) {
        //     this.guess("devdiaries"+Phaser.Math.Between(0, this.height),  "zzz");
        // }

        // if (Phaser.Input.Keyboard.JustDown(this.cursor.left)) {
        //     this.guess("devdiaries",  this.result);
        // }

        // if (Phaser.Input.Keyboard.JustDown(this.cursor.up)) {
        //     this.guess("devdiaries"+Phaser.Math.Between(0, this.height),  this.result);
        // }
    }


    createScoreBoard () {
        return [...Object.values(this.allPlayers)].sort((player1, player2) => player2.score - player1.score);
    }

    resetScore () {
        Object.values(this.allPlayers).forEach(player => player.reset());
        this.updateHighScore();
        this.number = 0;
        this.counter = 0;
        this.failed = false;
        this.lastWinningPlayer = "";
        this.romanNumbers.reset();
        this.current = this.result = this.romanNumbers.generateNext();
        this.generateNextOperation();
    }

    updateHighScore () {
        if (this.counter >= this.highestScore) {
            this.highestScore = this.counter;
            this.hightestScorePlayer = this.lastWinningPlayer;
            this.hightScoreText1.setText("HIGH SCORE: " + this.highestScore + " by");
            this.hightScoreText2.setText(this.hightestScorePlayer);
        }
    }

    generateNextOperation () {
        this.counter++;
        this.current = this.result;
        this.numberText.setText(this.current).setScale(1 - this.changeScale(this.current.length));
        this.result = this.romanNumbers.generateNext();
        console.log("Current: ", this.current, ",Next expected: ", this.result);
        this.playAudio("drip");
    }

    changeScale (length) {
        if (length < 6) return 0;
        if (length < 7) return 0.1;
        if (length < 8) return 0.2;
        if (length < 10) return 0.3;
        if (length < 15) return 0.4;
        if (length < 20) return 0.5;
    }


    showScore (playerName, score) {
        //this.scoreText1.setText(`Great!`).setAlpha(1);
        this.scoreText2.setText(`${playerName} +${score}`).setAlpha(1);
        // this.tweens.add({
        //     targets: [this.scoreText1],
        //     alpha: {from: 1, to: 0},
        //     ease: 'Linear',
        //     duration: 3000
        // })
    }

    showShame (playerName) {
        const rants = ["Dedecus es", "Pudeat te!!", "Nos omnes inhonoras", "Tu es destitutione!", "Tu deficiendi!"]
        this.scoreText1.setText(Phaser.Math.RND.pick(rants)).setAlpha(1);
        this.scoreText2.setText(`${playerName}`).setAlpha(1);
        this.tweens.add({
            targets: [this.scoreText1, this.scoreText2],
            alpha: {from: 1, to: 0},
            ease: 'Linear',
            duration: 3000,
            onComplete: () => {
                this.resetScore();
            }
        })
    }
}
