import Player from "./player";
import Chat from "./chat";

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

        let paramfg = urlParams.get('foreground') || "#F0EAD6";
        paramfg = parseInt(paramfg.substring(1), 16)
        this.foregroundColor = '0x' + paramfg.toString(16)

        this.spamTimeWait = 2;
        this.result = Phaser.Math.Between(1, 9);
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(+this.foregroundColor);
        this.allPlayers = {};

        this.addChat();
        this.loadAudios();
        this.addUI();
    }

    loadGame() {
        this.generateNextOperation ()
    }

    addChat () {
        this.chat = new Chat(this);
    }

    addUI () {
        this.circle = this.add.circle(this.center_width, this.center_height - 50, 100, 0xf22c2e);
        this.numberText = this.add.bitmapText(this.center_width, this.center_height - 50, "mainFont", this.number, 120).setOrigin(0.5).setTint(0x000000)
        this.operatorText = this.add.bitmapText(this.center_width, this.center_height + 80, "mainFont", `${this.nextOperator}${this.number}`, 50).setOrigin(0.5).setTint(0x000000)
        this.addClouds();
        this.addScore();
        this.byText = this.add.bitmapText(this.center_width, this.height -10, "mainFont", "by Pello", 10).setOrigin(0.5).setTint(0x000000);
    }

    addClouds () {
        this.cloudLeft = this.add.image(this.center_width - 100, this.center_height - 120 + Phaser.Math.Between(-15, 15), "cloud" + Phaser.Math.Between(1, 14)).setScale(Phaser.Math.Between(5, 9) * 0.1);
        this.cloudRight = this.add.image(this.center_width + 100, this.center_height + 30 + Phaser.Math.Between(-15, 15), "cloud" + Phaser.Math.Between(1, 14)).setScale(Phaser.Math.Between(4, 6) * 0.1);
        this.tweens.add({
            targets: [this.cloudLeft],
            x: {from: -156, to: this.width + 156},
            duration: 30000,
            onComplete: () => {
                this.cloudLeft.destroy();
            }
        })

        this.tweens.add({
            targets: this.cloudRight,
            x: {from: this.width + 156, to: -156},
            duration: 30000,
            onComplete: () => {
                this.cloudLeft.destroy();
                this.addClouds()
            }
        })
    }

    addScore () {
        const scoreBoard = this.createScoreBoard()
        this.add.bitmapText(this.center_width, 25, "mainFont", "zenbaki", 25).setOrigin(0.5).setTint(0x000000);
        scoreBoard.slice(0, 3).forEach((player, i) => {
            const winnerText = `${i+1}.  ${player.name}: ${player.score}`;
            this.add.bitmapText(this.center_width, 100 + (i * 50), "mainFont", winnerText, 30).setOrigin(0.5).setTint(this.foregroundColor).setDropShadow(1, 2, 0xbf2522, 0.7);
        })

        this.scoreText1 = this.add.bitmapText(this.center_width, this.center_height + 130, "mainFont", "", 20).setOrigin(0.5).setTint(0x000000);
        this.scoreText2 = this.add.bitmapText(this.center_width, this.center_height + 160, "mainFont", "", 25).setOrigin(0.5).setTint(0x000000);
    }


    addPlayer (name) {
        if (this.allPlayers[name]) return this.allPlayers[name];
        const player = new Player(this, name);
        this.allPlayers[name] = player;
        this.chat.say(`Player ${name} joins game!`);
        return player;
    }

    guess (playerName, number) {
        if (this.failed) return;
        console.log("Game> guess: ", playerName, number)

        const player = this.addPlayer(playerName);
        if (player.dead) return;
        if (player.hasSpammed()) return;
        player.lastMessage = new Date();

        console.log("Game> guess go on: ", playerName, number)

        if (this.result === parseInt(number)) {
            const score = this.calculateScore();
            player.score += score;
            this.showScore(playerName, score);
            this.generateNextOperation();
            console.log("Player", playerName, "guess", number);
        } else if (this.number === parseInt(number)) {
            console.log("Player, ", playerName, " is too slow");
        } else {
            this.cameras.main.shake(100, 0.01);
            this.playAudio("fail");
            this.failed = true;
            player.setPenalty()
            this.showShame(playerName);
            this.chat.say(`Player ${playerName} failed! Shame on you!`);
        }
    }

    showScores () {
        console.log
    }

    calculateScore () {
       const operatorPoints = {'+': 1, '-': 2, '*': 4, '/': 5};
        console.log("Game> calculateScore: ", this.counter,this.nextOperator, operatorPoints[this.nextOperator])
       return this.counter + operatorPoints[this.nextOperator];
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

    }

    showResult () {
        const scoreBoard = this.createScoreBoard()
        this.scoreRectangle = this.add.rectangle(0, 0, this.width, this.height, this.foregroundColor, 0.9).setOrigin(0, 0);
        this.scores = this.add.group();
        this.sensei = this.add.image(this.center_width, this.height - 60, "sensei", ).setOrigin(0.5).setScale(0.4)
        this.scores.add(this.sensei);
        this.scores.add(this.add.bitmapText(this.center_width, 60, "mainFont", "Senseis:", 30).setOrigin(0.5).setTint(0x000000));
        scoreBoard.slice(0, 5).forEach((player, i) => {
             const winnerText = `${i+1}.  ${player.name}, ${player.score}`;
             this.scores.add(this.add.bitmapText(this.center_width, 100 + (i * 20), "mainFont", winnerText, 15).setOrigin(0.5).setTint(0x000000));
        })


       console.log("ScoreBoard: ", scoreBoard)

        this.time.delayedCall(5000, () => {
            this.tweens.add({
                targets: [this.scoreRectangle, this.scores, this.sensei],
                duration: 1000,
                alpha: {from: 1, to: 0},
                onComplete: () => {
                    this.scoreRectangle.destroy();
                    this.scores.getChildren().forEach(function(child) {
                        child.destroy();
                    }, this);

                    this.scores.clear(true, true);
                }
            })
            this.resetScore();
            this.generateNextOperation();
        }, null, this)
    }

    createScoreBoard () {
        return [...Object.values(this.allPlayers)].sort((player1, player2) => player2.score - player1.score);
    }

    resetScore () {
        this.number = 0;
        this.counter = 0;
        this.failed = false;
    }

    generateNextOperation () {
        this.counter++;
        this.number = this.result;
        this.nextOperand = Phaser.Math.Between(1, 9);
        this.nextOperator = this.selectOperator();
        this.result = parseInt(eval(this.number + this.nextOperator + this.nextOperand));
        console.log("Current: ", this.number, " operator: ", this.nextOperator," nextNumber: ", this.nextOperand,",Result: ", this.result);
        this.showNextOperation(this.nextOperator, this.nextOperand);
        this.playAudio("drip");
    }

    selectOperator () {
        if (this.number % this.nextOperand === 0 && this.nextOperand !== 1) {
            console.log("Choice 1", this.number, this.nextOperand, this.result)
            return Phaser.Math.RND.pick(['+', '-', '+', '-', '/']);
        } else if (this.number + this.nextOperand >= 100) {
            return Phaser.Math.RND.pick(['-']);
        } else if (this.number - this.nextOperand <= -100) {
            return Phaser.Math.RND.pick(['+']);
        } else if (Math.abs(this.number * this.nextOperand) < 100) {
            return Phaser.Math.RND.pick(['+', '-', '+', '-', '*']);
        } else {
            return Phaser.Math.RND.pick(['+', '-', '+', '-']);
        }
    }

    showScore (playerName, score) {
        this.scoreText1.setText(`Great!`).setAlpha(1);
        this.scoreText2.setText(`${playerName} +${score}`).setAlpha(1);
        this.tweens.add({
            targets: [this.scoreText1],
            alpha: {from: 1, to: 0},
            ease: 'Linear',
            duration: 3000
        })
    }

    showShame (playerName) {
        const rants = ["You're a disgrace", "Shame on you", "You dishonor us all", "You're a disappointment", "You're a failure", "You dishonor this dojo"]
        this.scoreText1.setText(Phaser.Math.RND.pick(rants)).setAlpha(1);
        this.scoreText2.setText(`${playerName}`).setAlpha(1);
        this.tweens.add({
            targets: [this.scoreText1, this.scoreText2],
            alpha: {from: 1, to: 0},
            ease: 'Linear',
            duration: 3000,
            onComplete: () => {
                this.showResult();
            }
        })
    }

    showNextOperation (operator, nextNumber) {
        this.numberText.setText(this.number)
        this.operatorText.setText(`${operator}${nextNumber}`)
    }
}
