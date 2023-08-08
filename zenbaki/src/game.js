import Player from "./player";
import Chat from "./chat";

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
        this.lastMessage = null;
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
        this.circle = this.add.circle(this.center_width, this.center_height, 100, 0xf22c2e);
        this.numberText = this.add.bitmapText(this.center_width, this.center_height, "mainFont", this.number, 70).setOrigin(0.5).setTint(0x000000)
        this.operatorText = this.add.bitmapText(this.center_width, this.center_height + 80, "mainFont", `${this.nextOperator}${this.number}`, 30).setOrigin(0.5).setTint(0x000000)

        this.addScore();
    }

    addScore () {
        const scoreBoard = this.createScoreBoard()
        this.add.bitmapText(this.center_width, 25, "mainFont", "Scoreboard", 30).setOrigin(0.5).setTint(0x000000);
        scoreBoard.slice(0, 3).forEach((player, i) => {
            const winnerText = `${i+1}.  ${player.name}: ${player.score}`;
            this.add.bitmapText(this.center_width, 100 + (i * 50), "mainFont", winnerText, 30).setOrigin(0.5).setTint(0xFFD700).setDropShadow(1, 2, 0xbf2522, 0.7);
        })
    }


    addPlayer (name) {
        if (this.allPlayers[name]) return this.allPlayers[name];
        const player = new Player(this, name);
        this.allPlayers[name] = player;
        this.chat.say(`Player ${name} joins game!`);
        return player;
    }

    guess (playerName, number) {
        console.log("Game> guess: ", playerName, number)

        const player = this.addPlayer(playerName);
        console.log("Game> guess 2: ", playerName, number)
        if (player.dead) return;
        console.log("Game> guess 3: ", playerName, number)
        if (player.hasSpammed()) return;
        console.log("Game> guess 4: ", playerName, number)
        player.lastMessage = new Date();


        console.log("Game> guess go on: ", playerName, number)

        if (this.result === parseInt(number)) {
            player.partialScore += this.counter * 10;
            this.generateNextOperation();
            console.log("Player", playerName, "guess", number);
        } else {
            // resetAllPlayersPartialScore();
            this.resetScore();
            this.chat.say(`Player ${playerName} invalid attack values. Use speed: 0-100, angle: 0-360!`);
        }
    }

    isValidNumber (number) {
        return !isNaN(number) && number >= 0 && number < this.width;
    }

    loadAudios () {
        this.audios = {
            win: this.sound.add("win")
        };
    }

    playAudio (key) {
        this.audios[key].play();
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

    checkGameOver () {
        console.log(this.allPlayers, Object.values(this.allPlayers));
        const remaining = Object.values(this.allPlayers).map(player => player.dead).length;

        if (remaining == 1) {
            const last = Object.values(this.allPlayers).find(player => !player.dead) ;
            this.winner = last ? last.name : "No Winn" ;
            this.gameOver = true;
        } else if (remaining <= 1) {
            this.winner = "No Winn"
            this.gameOver = true;
            this.showResult();
        }
    }

    showResult () {
        const scoreBoard = this.createScoreBoard()

        this.add.bitmapText(this.center_width, 80, "mainFont", "Game Over:", 30).setOrigin(0.5).setTint(0xFFD700).setDropShadow(1, 2, 0xbf2522, 0.7);
        scoreBoard.slice(0, 5).forEach((player, i) => {
            const winnerText = `${i+1}.  ${player.name}, kills: ${player.kills.length}`;
            this.add.bitmapText(this.center_width, 170 + (i * 50), "mainFont", winnerText, 30).setOrigin(0.5).setTint(0xFFD700).setDropShadow(1, 2, 0xbf2522, 0.7);
        })

       console.log("ScoreBoard: ", scoreBoard[0].name)

       this.restart = this.add.bitmapText(this.center_width, this.height - 100, "mainFont", "CLICK TO RESTART", 30).setOrigin(0.5).setTint(0xFFD700).setDropShadow(1, 2, 0xbf2522, 0.7);
       this.restart.setInteractive();
       this.restart.on('pointerdown', () => {
            this.scene.start("splash")
        })
    }

    createScoreBoard () {
        return [...Object.values(this.allPlayers)].sort((player1, player2) => player2.partialScore - player1.partialScore);
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }

    resetScore () {
        this.number = 0;
        this.counter = 0;
    }

    generateNextOperation () {
        this.counter++;
        this.nextOperator = Phaser.Math.RND.pick(['+', '-', '*', '+', '-', '*', '/']);
        this.nextNumber = Phaser.Math.Between(1, 10);
        this.number = this.result;
        this.result = parseInt(eval(this.number + this.nextOperator + this.nextNumber));
        console.log("Current: ", this.number, " operator: ", this.nextOperator," nextNumber: ", this.nextNumber,",Result: ", this.result);
        this.showNextOperation(this.nextOperator, this.nextNumber);
    }

    showNextOperation (operator, nextNumber) {
        this.numberText.setText(this.number)
        this.operatorText.setText(`${operator}${nextNumber}`)
    }
}
