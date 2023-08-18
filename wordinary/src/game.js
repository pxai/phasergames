import Player from "./player";
import Chat from "./chat";
import Word from "./word";
import Letter from "./letter";
import letterValues from "./letters";

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
        this.lastMessage = null;
        this.currentWord = "";
        this.counter = 0;
    }

    init (data) {
        this.dictionary = data.dictionary;
    }

    preload () {
        const urlParams = new URLSearchParams(window.location.search);
        let parambg = urlParams.get('background') || "#00b140";
        parambg = parseInt(parambg.substring(1), 16)
        this.backgroundColor = '0x' + parambg.toString(16)

        let paramfg = urlParams.get('foreground') || "#005ba5";
        paramfg = parseInt(paramfg.substring(1), 16)
        this.foregroundColor = '0x' + paramfg.toString(16)

        this.spamTimeWait = 2;
        this.currentWord = this.dictionary.randomWord();
        this.chained = false;
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        console.log("Setting bg", this.backgroundColor)
        this.cameras.main.setBackgroundColor(0x00b140);
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
        this.helpText = this.add.bitmapText(196, this.center_height + 16, "mainFont", "Write a word that starts with this ending", 20).setTint(this.foregroundColor).setDropShadow(1, 2, 0xffffff, 0.7);
        this.helpArrow = this.add.image(((this.currentWord.length - 1) * 42), this.center_height , "arrow").setScale(0.5).setTint(this.foregroundColor);

        this.addScore();
        this.byText = this.add.bitmapText(this.width - 50, 10, "mainFont", "by Pello", 15).setOrigin(1).setTint(0x000000).setDropShadow(1, 1, 0xffffff, 0.7);
    }

    writeCurrentWordText () {
        if (this.letter) {
            this.letter.destroy();
        }

        this.letter = new Letter(this, 32, 48, { letter: this.currentWord.slice(0,1), points: this.getPointsForLetter(this.currentWord.slice(0,1))})

        this.currentWord.substring(1).split("").forEach((letter, i) => {
            this.letter.addLetters([{ letter, points: this.getPointsForLetter(letter)}])
        });
    }

    writeProposedText (text) {
        if (text === "" && this.proposedText) {
            this.proposedText.destroy();
        }

        console.log("Reset? ", this.proposedText, this.helpText)
        if (this.helpText) {
            console.log("Destriy ")
            this.helpText.destroy();
            this.helpArrow.destroy();
        }

        if (this.proposedText) {
            this.proposedText.destroy();
        }
        if (!text) return;

        this.proposedText = new Letter(this, this.center_width - 64, this.center_height, { letter: text.slice(0,1), points: this.getPointsForLetter(text.slice(0,1))})

        text.substring(1).split("").forEach((letter, i) => {
            this.proposedText.addLetters([{ letter, points: this.getPointsForLetter(letter)}])
        });
    }

    getPointsForLetter (letter) {
        return letterValues['en'][letter.toLowerCase()] || 1;
    }

    addScore () {
        const scoreBoard = this.createScoreBoard()
        this.add.bitmapText(this.width - 196, 0, "mainFont", "Wordinary", 25).setOrigin(0).setTint(0xF1F1E6);
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

        const player = this.addPlayer(playerName);
        player.lastMessage = new Date();
        console.log("Game> try guess: isValid ", !this.word.isValid(playerWord) , " is previous: ",   playerWord === this.currentWord)
        if (playerWord === this.currentWord) return;

        if (playerWord === "wordinary")  {
            this.cameras.main.shake(100, 0.01);
            this.generateNextOperation(this.dictionary.randomWord());
            return;
        }

        const overlap = this.word.overlap(this.currentWord, playerWord);
        console.log("Game> Is it valid?", playerName, playerWord, this.previousWowrd," overlap: ", overlap, "  this.chained: ", this.chained, "  this.word.isValid: ", this.word.isValid(playerWord));
        if (this.word.isValid(playerWord) && overlap > 1 && !this.chained) {
            this.chained = true;
            const score = this.calculateScore(overlap, playerWord);
            player.score += score;
            this.showScore(playerName, playerWord, score);
            console.log("Player", playerName, "guess", playerWord);
            this.time.delayedCall(3000, () => { this.generateNextOperation(playerWord) }, null, this);
            this.showResult()
        }
    }

    showScores () {
        console.log
    }

    calculateScore (overlap, playerWord) {
        const points = this.calculateWordPoints(playerWord);
        console.log("Game> calculateScore: ", overlap, playerWord, playerWord.length, points)
        return overlap + playerWord.length + points;
    }

    calculateWordPoints(word) {
        return word.split("").map((letter, i) =>  this.getPointsForLetter(letter)).reduce((a, b) => a + b, 0);
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
        //this.scoreRectangle = this.add.rectangle(0, 0, this.width, this.height, this.foregroundColor, 0.9).setOrigin(0, 0);

        if (this.scores) {
            this.scores.destroy(true);
        }
        this.scores = this.add.group();

        let previousName = "";
        let previousPosition = 0;

        scoreBoard.slice(0, 3).forEach((player, i) => {
             const winnerText = `${i+1}. ${player.name}: ${player.score}.`;
             const x = !previousName ? 8 : previousPosition + (previousName.width * 8) + 16;
             const size = i === 0 ? 20 : 15;
             this.scores.add(this.add.bitmapText(x, 2, "mainFont", winnerText, size).setOrigin(0).setTint(0x000000).setTint(this.foregroundColor).setDropShadow(1, 1, 0xffffff, 0.7));
             previousName = winnerText;
             previousPosition = x;
        })


       console.log("ScoreBoard: ", scoreBoard)
    }

    createScoreBoard () {
        return [...Object.values(this.allPlayers)].sort((player1, player2) => player2.score - player1.score);
    }

    resetScore () {
        this.currentWord = this.dictionary.randomWord()
        this.counter = 0;
        this.chained = false;
    }

    generateNextOperation (playerWord) {
        this.counter++;
        this.currentWord = playerWord;
        this.showNextWord(this.currentWord);
        this.playAudio("drip");
        this.chained = false;
    }

    showScore (playerName, playerWord, score) {
        this.scoreText1.setText(`Great!`).setAlpha(1);
        this.scoreText2.setText(`${playerName} +${score}`).setAlpha(1).setTint(this.foregroundColor).setDropShadow(1, 2, 0xffffff, 0.7);;

        this.writeProposedText(playerWord)
        this.tweens.add({
            targets: [this.scoreText1, this.scoreText2],
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
