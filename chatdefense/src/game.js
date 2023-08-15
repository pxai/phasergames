import Player from "./player";
import Chat from "./chat";
import Castle from "./castle";
import Word from "./word";
import LetterGenerator from "./letter_generator";
import { Dust, Explosion } from "./particle";
import letterValues from "./letters";
import Letter from "./letter";

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }

    init (data) {
        this.dictionary = data.dictionary;
        this.number = 0;
    }


    preload () {
        const urlParams = new URLSearchParams(window.location.search);
        let param = urlParams.get('background') || "#00b140";
        param = parseInt(param.substring(1), 16)

        this.speed = +urlParams.get('speed') || 10;
        this.backgroundColor = '0x' + param.toString(16)
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(+this.backgroundColor);
        this.physics.world.setBoundsCollision(true, true, false, true);
        this.gameOver = false;
        this.word = new Word(this.dictionary);
        this.infoPanel = Array(6).fill(this.add.bitmapText(0, 0, "mainFont", "", 0));
        this.addChat();
        this.loadAudios();
        this.cursor = this.input.keyboard.createCursorKeys();
        this.allPlayers = {}
        this.loadGame()
        this.gameLayer = this.add.layer();
        this.letterGenerator = new LetterGenerator(this);
        this.cursor = this.input.keyboard.createCursorKeys();

    }

    addChat () {
        this.chat = new Chat(this);
    }

    loadGame () {
        this.addMap();
       // this.addHelp();
        // this.playMusic();
    }

    addHelp () {
        this.add.bitmapText(35, 50, "mainFont", "!join", 10).setOrigin(0).setTint(0xFFD700).setDropShadow(1, 1, 0xbf2522, 0.7);
        this.add.bitmapText(35, 65, "mainFont", "!f speed angle", 10).setOrigin(0).setTint(0xFFD700).setDropShadow(1, 1, 0xbf2522, 0.7);
        // this.add.sprite(35, 80, "help").setScale(1).setOrigin(0).setTint(0xFFD700)
    }

    addMap () {
        this.waterTime = 0;
        this.tileMap = this.make.tilemap({ key: `scene${this.number}`, tileWidth: 32, tileHeight: 32 });

        this.tileSetBg = this.tileMap.addTilesetImage("map");
        this.backgroundLayer = this.tileMap.createLayer("background", this.tileSetBg);

        this.tileSet = this.tileMap.addTilesetImage("map");
        this.platform = this.tileMap.createLayer(`scene${this.number}`, this.tileSet);
        this.objectsLayer = this.tileMap.getObjectLayer("objects");

        this.platform.setCollisionByExclusion([-1]);

        this.dustLayer = this.add.layer();

        this.allPlayers = {};
        this.letters = this.add.group();
        this.texts = [];


        this.objectsLayer.objects.forEach(object => {
            if (object.name === "castle") {
                this.castle = new Castle(this, object.x, object.y);
            }

            if (object.name === "start") {
                this.spawnPoint = { x: object.x, y: object.y };
            }
        });

        this.createGrid();

        this.physics.add.collider(this.letters, this.platform, this.hitFloor, () => {
            return true;
        }, this);

        this.physics.add.collider(this.letters, this.castle, this.hitCastle, () => {
            return true;
        }, this);
    }

    createGrid () {
        this.grid = [];

        Array(25).fill(0).forEach((_,i) => {
          this.grid[i] = []
          Array(8).fill(0).forEach((_, j) => {
            let rock = this.platform.getTileAt(Math.floor(j), Math.floor(i));
            this.grid[i][j] = rock ?  1 : 0;
          });
        });
      }

    addPlayer (name) {
        if (this.allPlayers[name]) return this.allPlayers[name];

        const player = new Player(this, name);
        this.allPlayers[name] = player;
        this.chat.say(`Player ${name} joins game!`);
        this.updateInfoPanel(`Player ${name} joins game!`);
        return player;
    }


    hitFloor (letter, platform) {
    }

    hitCastle (letter, castle) {
        letter.destroy();
        this.cameras.main.shake(100, 0.01);
        new Explosion(this, letter.x, letter.y);
        this.castle.hit(letter.letter.points);
    }


    getTile(platform) {
        const {x, y} = platform;
        return this.platform.getTileAt(x, y);
      }

    fireballHitPlatform (fireball, platform) {
        //if (!fireball.activate) return
        const tile = this.getTile(platform)
        if (tile && tile.x) {
            this.platform.removeTileAt(tile.x, tile.y);
            fireball.destroy();
            this.explosions.add(new Explosion(this, fireball.x, fireball.y, fireball.shooter))
            this.playAudio("boom")
        }

        //platform.destroy();
    }


    isValidNumber (number) {
        return !isNaN(number) && number >= 0 && number < this.width;
    }

    isValidRange (number, range) {
        return this.isValidNumber(number) && number >= 0 && number <= range;
    }

    loadAudios () {
        this.audios = {
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
        // if (Phaser.Input.Keyboard.JustDown(this.cursor.down)) {
        //     this.showResult();
        // }
    }

    guess (playerName, playerWord) {
        const player = this.addPlayer(playerName);

        console.log("Game> try guess ", playerWord, ", isValid ", !this.word.isValid(playerWord) , " is current: ", this.currentLetters(), " solves? ", this.solvesWithCurrent(playerWord));

        if (this.word.isValid(playerWord) && this.solvesWithCurrent(playerWord)) {
            const score = this.calculateScore(playerWord);
            this.destroySolvedLetters(playerWord);
            this.writeProposedText(playerWord);

            player.score += score;
            this.updateInfoPanel(`${playerName}, solved with ${playerWord}, ${score}pts`);

        }
    }

    destroySolvedLetters(playerWord) {
        playerWord.split("").forEach(playerLetter => {
            this.letters.children.entries.filter(letter => letter.active).forEach(letter => {
                if (playerLetter === letter.letter.letter) {
                    letter.destroy();
                    new Explosion(this, letter.x, letter.y);
                }
            });
        });
    }

    calculateScore (playerWord) {
        const points = this.calculateWordPoints(playerWord);
        return playerWord.length + points;
    }

    calculateWordPoints(word) {
        return word.split("").map((letter, i) =>  this.getPointsForLetter(letter)).reduce((a, b) => a + b, 0);
    }

    getPointsForLetter (letter) {
        return letterValues['en'][letter.toLowerCase()] || 1;
    }

    solvesWithCurrent (word) {
        return word.split().some((string) => this.currentLetters().indexOf(string) === -1);
    }

    checkGameOver () {
        this.gameOver = true;
        this.showResult();
    }


    showResult () {
        const scoreBoard = this.createScoreBoard()

        if (this.scores) {
            this.scores.destroy(true);
        }
        this.scores = this.add.group();

        this.add.rectangle(0, 0, 300, this.height, 0x000000).setAlpha(0.5).setOrigin(0);
        this.add.bitmapText(10, 8, "mainFont", "ChatDefense", 30).setOrigin(0).setTint(0xffffff).setTint(this.foregroundColor).setDropShadow(1, 1, 0xffffff, 0.7);

        this.add.bitmapText(10, 32, "mainFont", "Scoreboard", 25).setOrigin(0).setTint(0xffffff).setTint(this.foregroundColor).setDropShadow(1, 1, 0xffffff, 0.7);
        scoreBoard.slice(0, 10).forEach((player, i) => {
             const winnerText = `${i+1}. ${player.name}: ${player.score}.`;
             this.scores.add(this.add.bitmapText(10, 100 + (i * 32), "mainFont", winnerText, 20).setOrigin(0).setTint(0xffffff).setTint(this.foregroundColor).setDropShadow(1, 1, 0xffffff, 0.7));
        })


        this.reloadText = this.add.bitmapText(64, this.height - 32, "mainFont", "RESTART", 30);
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

    writeProposedText (text) {
        if (text === "" && this.proposedText) {
            this.proposedText.destroy();
        }


        if (this.proposedText) {
            this.proposedText.destroy();
        }

        if (!text) return;

        this.proposedText = new Letter(this, 200, 32, { letter: text.slice(0,1), points: this.getPointsForLetter(text.slice(0,1))}, true)

        text.substring(1).split("").forEach((letter, i) => {
            this.proposedText.addLetters([{ letter, points: this.getPointsForLetter(letter)}])
        });

        this.time.delayedCall(2000, () => {
            this.proposedText.destroy();
        }, null, this)
    }


    createScoreBoard () {
        return [...Object.values(this.allPlayers)].sort((player1, player2) => player2.score - player1.score);
    }

    updateInfoPanel (text) {
        this.infoPanel.pop().destroy();
        this.infoPanel.forEach((text, i) =>{ text.y += 32; })
        const addedText = this.add.bitmapText(0, 64, "mainFont", text, 15).setDropShadow(1, 1, 0xFFD700, 0.7);
        this.infoPanel.unshift(addedText);

        this.tweens.add({
            targets: this.infoPanel[0],
            duration: 10000,
            alpha: {from: 1 , to: 0},
        })
    }

    currentLetters () {
        return this.letters.children.entries.filter(letter => letter.active).map(letter => letter.letter.letter);
    }
}
