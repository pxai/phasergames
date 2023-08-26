import Player from "./player";
import Chat from "./chat";
import Quiz from "./questions";

const MAX_ANSWERS = 4;

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

        this.difficulties = urlParams.get('difficulties') || "easy";
        this.categories = urlParams.get('categories') || "";
        this.rounds = this.isValidNumber(urlParams.get('rounds')) ? +urlParams.get('rounds') : "";
        this.roundCount = 0;

        let paramfg = urlParams.get('foreground') || "#914104";
        paramfg = parseInt(paramfg.substring(1), 16)
        this.foregroundColor = '0x' + paramfg.toString(16)

        this.spamTimeWait = 2;
        this.result = Phaser.Math.Between(1, 9);
        this.cursor = this.input.keyboard.createCursorKeys();
        this.timeToAnswer = +urlParams.get('timeToAnswer') * 1000 || 15000;
        this.timeCount = this.timeToAnswer / 1000;
        this.timeForNext = 4000;
        this.infiniteLoop = !this.rounds;
    }

    async create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(+this.foregroundColor);
        this.allPlayers = {};

        this.addChat();
        this.loadAudios();
        await this.loadQuestions()
        this.addUI();

        this.showNextQuestion();
    }

    async loadQuestions () {
        this.quiz = new Quiz();
        await this.quiz.init(this.difficulties, this.categories);
    }

    addChat () {
        this.chat = new Chat(this);
    }

    addUI () {
        this.rectanglesLayer = this.add.layer();
        this.answerwLayer = this.add.layer();
        this.logo = this.add.image(0,0, "squiz_logo").setOrigin(0).setAlpha(0.2)
        this.questionText = this.add.bitmapText(this.center_width, 8, "nuno", "question", 30).setOrigin(0.5, 0).setTint(0xffffff)
        this.timeCountText = this.add.bitmapText(this.width - 64, this.center_height, "mainFont", this.timeCount, 140).setAlpha(0.2).setOrigin(0.5);
        this.answers = Array(4).fill('').map((_, i) => {
            const answer = this.add.bitmapText(8 + (242 * i), this.height - 90 , "nuno", `Question ${i}`, 20).setOrigin(0).setTint(0xffffff);
            this.answerwLayer.add(answer)
            return answer;
        });
        //this.addScore();
        this.byText = this.add.bitmapText(this.center_width, this.height -10, "mainFont", "SQUIZ by Pello", 10).setOrigin(0.5).setTint(0xffffff);
    }

    showNextQuestion() {
        this.timeCount = this.timeToAnswer / 1000;
        this.showTimer();
        const question = this.quiz.nextQuestion();
        console.log("This is next!! ", question, this.quiz.currentIndex)
        if (!question) {
            this.showResult();
            return;
        }
        if (this.rectangles) { this.rectangles.clear(true, true); }
        this.rectangles = this.add.group();
        this.questionText.setText(question.question).setMaxWidth(700);
        this.answers.forEach((answer , i)=> {
            answer.setText(`${i+1}. ${question.answers[i]}`).setTint(0xffffff).setMaxWidth(200)
            const rectangle = this.add.rectangle(answer.x, answer.y - 8, 238, answer.height + 16, 0xfdba21).setOrigin(0).setAlpha(0.2)
            this.rectangles.add(rectangle)
            this.rectanglesLayer.add(rectangle)
        });
        this.showTimestamp = new Date();
        this.time.delayedCall(this.timeToAnswer, () =>{ this.showCorrect()}, null, this )
        this.showingResult = false;

    }

    showTimer() {
        if (this.timeCount === 0) return;

        this.time.delayedCall(1000, () => {
            this.timeCountText.setText(this.timeCount - 1);
           this.timeCount--;
           this.showTimer();
        }, null, this);
    }

    showCorrect() {
        this.rectangles.getChildren()[this.quiz.currentQuestion.correctIndex - 1].setAlpha(1)
        this.time.delayedCall(this.timeForNext, () =>{ this.showNextQuestion()}, null, this )
    }

    addScore () {
        const scoreBoard = this.createScoreBoard()
        scoreBoard.slice(0, 3).forEach((player, i) => {
            const winnerText = `${i+1}.  ${player.name}: ${player.points}pt ${player.time}ms`;
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
        if (this.showingResult) return;
        console.log("Game> guess: ", playerName, number)

        const player = this.addPlayer(playerName);
        player.lastMessage = new Date();

        console.log("Game> guess go on: ", playerName, number)

        if (this.isValidValue(number) && player.notAnswered(this.quiz.currentIndex)) {
            player.answerQuestion(this.quiz.currentIndex, new Date() - this.showTimestamp, number === this.quiz.currentQuestion.correctIndex)
            console.log("Player", playerName, "guess", number);
        }
    }

    showScores () {
    }

    isValidValue (number) {
        return !isNaN(number) && number >= 1 && number <= MAX_ANSWERS;
    }

    isValidNumber (number) {
        return !isNaN(number) && number >= 1;
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
        if (Phaser.Input.Keyboard.JustDown(this.cursor.left)) {
            this.guess("devdiaries", Phaser.Math.Between(1,4));
        }
    }

    showResult () {
        this.showingResult = true;
        const scoreBoard = this.createScoreBoard()
        this.scoreRectangle = this.add.rectangle(0, 0, this.width, this.height, this.foregroundColor, 0.9).setOrigin(0, 0);
        this.scores = this.add.group();
        this.scores.add(this.add.bitmapText(this.center_width, 20, "mainFont", "Scoreboard", 50).setOrigin(0.5).setTint(0xffffff));
        scoreBoard.slice(0, 5).forEach((player, i) => {
             const winnerText = `${i+1}.  ${player.name}, ${player.points}pts ${player.time}`;
             this.scores.add(this.add.bitmapText(this.center_width, 60 + (i * 20), "mainFont", winnerText, 15).setOrigin(0.5).setTint(0x000000));
        })


       console.log("ScoreBoard: ", scoreBoard)

        this.time.delayedCall(5000, async() => {
            this.resetScore();
            this.roundCount++;
            console.log("Is infinite loop? ", this.infiniteLoop, " roundcount: " ,this.roundCount, " rounds:", this.rounds)
            if (this.infiniteLoop || (this.roundCount < this.rounds)) {
                this.tweens.add({
                    targets: [this.scoreRectangle, this.scores],
                    duration: 1000,
                    alpha: {from: 1, to: 0},
                    onComplete: async () => {
                        this.scoreRectangle.destroy();
                        this.scores.getChildren().forEach(function(child) {
                            child.destroy();
                        }, this);

                        this.scores.clear(true, true);
                        await this.loadQuestions();
                        this.showNextQuestion()
                    }
                })
            } else {
                console.log("End of game!")
                this.reloadText = this.add.bitmapText(this.width - 128, this.center_height, "mainFont", "RESTART", 40);
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
            }

        }, null, this)
    }

    createScoreBoard () {
        return [...Object.values(this.allPlayers)].sort(function(player1, player2) {
            if (player1.points === player2.points) {
               return player1.time - player2.time;
            }
            return player1.points < player2.points ? 1 : -1;
         });

          //  (player1, player2) => player2.points - player1.points).sort((player1, player2) => player1.time - player2.time);
    }

    resetScore () {
        this.number = 0;
        this.counter = 0;
        this.failed = false;
        this.quiz.currentIndex = 0;
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
}
