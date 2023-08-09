import Player from "./player";
import Chat from "./chat";
import Word from "./word";
import Letter from "./letter";

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
        this.lastMessage = null;
        this.currentWord = "";
        this.counter = 0;
        this.failed = false;
    }

    init (data) {
        this.dictionary = data.dictionary;
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
        this.currentWord = this.dictionary.randomWord();
        this.previousWord = "";
        this.chained = false;
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(+this.foregroundColor);
        this.allPlayers = {};
        this.word = new Word(this.dictionary);

        this.addChat();
        this.loadAudios();
        this.addUI();
    }

    addChat () {
        this.chat = new Chat(this);
    }

    addUI () {
        this.writeCurrentWordText();
        this.writeProposedText("(chain a word)")

        this.addScore();
        this.byText = this.add.bitmapText(this.center_width, this.height -10, "mainFont", "by Pello", 10).setOrigin(0.5).setTint(0x000000);
    }

    writeCurrentWordText () {
        console.log(" so: ", new Date())
        if (this.letter) {
            this.letter.destroy();
        }
        this.letter = new Letter(this, 32, 48, { letter: this.currentWord.slice(0,1), points: 1})

        this.currentWord.substring(1).split("").forEach((letter, i) => {
            this.letter.addLetters([{ letter, points: 1}])
        });
    }

    writeProposedText (text) {
        if (text === "" && this.proposedText) {
            this.proposedText.destroy();
            return;
        }

        if (this.proposedText) {
            this.proposedText.destroy();
        }

        this.proposedText = new Letter(this, this.center_width - 64, this.center_height, { letter: text.slice(0,1), points: 1})

        text.substring(1).split("").forEach((letter, i) => {
            this.proposedText.addLetters([{ letter, points: 1}])
        });
        this.proposedText.setScale(0.5)
    }

    addScore () {
        const scoreBoard = this.createScoreBoard()
        this.add.bitmapText(this.center_width, 25, "mainFont", "zenbaki", 25).setOrigin(0.5).setTint(0x000000);
        scoreBoard.slice(0, 3).forEach((player, i) => {
            const winnerText = `${i+1}.  ${player.name}: ${player.score}`;
            this.add.bitmapText(this.center_width, 100 + (i * 50), "mainFont", winnerText, 30).setOrigin(0.5).setTint(this.foregroundColor).setDropShadow(1, 2, 0xbf2522, 0.7);
        })

        this.scoreText1 = this.add.bitmapText(this.center_width, this.center_height + 40, "mainFont", "", 20).setOrigin(0.5).setTint(0x000000);
        this.scoreText2 = this.add.bitmapText(this.center_width, this.center_height + 60, "mainFont", "", 25).setOrigin(0.5).setTint(0x000000);
    }


    addPlayer (name) {
        if (this.allPlayers[name]) return this.allPlayers[name];
        const player = new Player(this, name);
        this.allPlayers[name] = player;
        this.chat.say(`Player ${name} joins game!`);
        return player;
    }

    guess (playerName, playerWord) {
        console.log("Game> try guess: ", playerName, playerWord)
        if (this.failed) return;
        console.log("Game> try: ", playerName, playerWord)

        const player = this.addPlayer(playerName);
        console.log("Game> try guess: ", playerName, playerWord, this.failed, player.dead, player.hasSpammed())
        if (player.dead) return;
        if (player.hasSpammed()) return;
        player.lastMessage = new Date();
        console.log("Game> try guess: isValid ", !this.word.isValid(playerWord) , " is previous: ",  this.previousWord, playerWord === this.previousWord)
        if (playerWord === this.previousWord) return;

        const overlap = this.word.overlap(this.currentWord, playerWord);
        console.log("Game> IN DICTIONARY! guess go on: ", playerName, playerWord, " overlap: ", overlap, "  this.chained: ", this.chained)
        if (this.word.isValid(playerWord) && overlap > 1 && !this.chained) {
            this.chained = true;
            const score = this.calculateScore(overlap, playerWord);
            player.score += score;
            this.showScore(playerName, playerWord, score);
            console.log("Player", playerName, "guess", playerWord);
            this.time.delayedCall(3000, () => { this.generateNextOperation(playerWord) }, null, this);
        } else if (this.word.isValid(playerWord) &&  overlap > 1 && this.chained) {
            console.log("Player guessed after", playerName, "guess", playerWord);
            const score = this.calculateScore(overlap, playerWord);
            player.score += score;
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

    calculateScore (overlap, playerWord) {
        console.log("Game> calculateScore: ", overlap, playerWord, playerWord.length)
       return this.counter + overlap + playerWord.length;
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
            this.generateNextOperation(this.dictionary.randomWord());
        }, null, this)
    }

    createScoreBoard () {
        return [...Object.values(this.allPlayers)].sort((player1, player2) => player2.score - player1.score);
    }

    resetScore () {
        this.currentWord = this.dictionary.randomWord()
        this.counter = 0;
        this.chained = false;
        this.failed = false;
    }

    generateNextOperation (playerWord) {
        this.counter++;
        if (this.previousWord !== "") this.previousWord = this.currentWord;
        this.currentWord = playerWord;
        console.log("Current: ", this.currentWord);
        this.showNextWord(this.currentWord);
        this.playAudio("drip");
        this.chained = false;
    }

    showScore (playerName, playerWord, score) {
        this.scoreText1.setText(`Great!`).setAlpha(1);
        this.scoreText2.setText(`${playerName} +${score}`).setAlpha(1);

        this.writeProposedText(playerWord)
        this.tweens.add({
            targets: [this.scoreText1],
            alpha: {from: 1, to: 0},
            ease: 'Linear',
            duration: 3000,
            onComplete: () => {
                this.writeProposedText("")
            }
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

    showNextWord () {
        this.writeCurrentWordText()
        this.writeProposedText("")
    }
}
