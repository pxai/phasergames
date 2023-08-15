import Player from "./player";
import Chat from "./chat";
import Castle from "./castle";
import LetterGenerator from "./letter_generator";

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }

    init (data) {
        this.name = data.name;
        this.number = 0;
    }

    preload () {
        const urlParams = new URLSearchParams(window.location.search);
        let param = urlParams.get('background') || "#00b140";
        param = parseInt(param.substring(1), 16)
        this.backgroundColor = '0x' + param.toString(16)
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(+this.backgroundColor);
        this.physics.world.setBoundsCollision(true, true, false, true);
        this.infoPanel = Array(6).fill(this.add.bitmapText(0, 0, "mainFont", "", 0));
        this.addChat();
        this.loadAudios();
        this.cursor = this.input.keyboard.createCursorKeys();
        this.allPlayers = {}
        this.loadGame()
        this.letterGenerator = new LetterGenerator(this);

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

        this.tileSetItems = this.tileMap.addTilesetImage("tiles");
        this.tileMap.createLayer("items", this.tileSetItems);

        this.platform.setCollisionByExclusion([-1]);

        this.allPlayers = {};
        this.letters = this.add.group();
        this.texts = [];

        this.objectsLayer.objects.forEach(object => {
            if (object.name === "castle") {
                console.log("Adding castle at: ", object.x, object.y);
                this.castle = new Castle(this, object.x, object.y);
            }

            if (object.name === "start") {
                console.log("Adding start at: ", object.x, object.y);
                this.spawnPoint = { x: object.x, y: object.y };
            }
        });

        this.physics.add.collider(this.letters, this.platform, this.hitFloor, () => {
            return true;
        }, this);

        this.physics.add.collider(this.letters, this.castle, this.hitCastle, () => {
            return true;
        }, this);
    }

    addPlayer (name) {
        const player = new Player(this, name);
        console.log("Player added: ", player, this.allPlayers)
        this.allPlayers[name] = player;
        this.chat.say(`Player ${name} joins game!`);
        this.updateInfoPanel(`Player ${name} joins game!`);
    }


    hitFloor (letter, platform) {
    }

    hitCastle (letter, castle) {
        console.log("Hit castle by", letter)
        letter.destroy();
    }

    fireballHitShield (fireball, shield) {
        fireball.destroy();
        shield.destroy();
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
            fireball: this.sound.add("fireball"),
            step: this.sound.add("step"),
            death: this.sound.add("death"),
            boom: this.sound.add("boom"),
            fireball: this.sound.add("fireball"),
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
        if (Phaser.Input.Keyboard.JustDown(this.cursor.up)) {
            this.attack("devdiaries", Phaser.Math.Between(0, 100), Phaser.Math.Between(0, 360));
        }
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

    checkGameOver () {
        console.log(this.allPlayers, Object.values(this.allPlayers));
        const remaining = Object.values(this.allPlayers).map(player => !player.dead).length;

        if (remaining == 1) {
            const last = Object.values(this.allPlayers).find(player => !player.dead) ;
            this.winner = last ? last.name : "No Winn" ;
            this.gameOver = true;
        } else if (remaining <= 1)
            this.winner = "No Winn"
            this.gameOver = true;
            this.showResult();
    }

    createScoreBoard () {
        return [...Object.values(this.allPlayers)].sort((player1, player2) => player2.kills.length - player1.kills.length);
    }

    updateInfoPanel (text) {
        this.infoPanel.pop().destroy();
        this.infoPanel.forEach((text, i) =>{ text.y += 32; })
        const addedText = this.add.bitmapText(0, 64, "mainFont", text, 15).setDropShadow(1, 1, 0xFFD700, 0.7);
        this.infoPanel.unshift(addedText);
        console.log("Info: ", this.infoPanel)
        this.tweens.add({
            targets: this.infoPanel[0],
            duration: 5000,
            alpha: {from: 1 , to: 0},
        })
    }
}
