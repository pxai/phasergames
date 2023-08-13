import Player from "./player";
import Chat from "./chat";
import Scenario from "./scenario";
import Chopper from "./chopper";
import Weather from "./weather";
import Lightning from "./lightning";

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }

    init (data) {
        this.name = data.name;
        this.number = Phaser.Math.RND.pick([0, 1, 2, 3])
    }

    preload () {
        const urlParams = new URLSearchParams(window.location.search);
        let param = urlParams.get('background') || "#00b140";
        param = parseInt(param.substring(1), 16)
        this.backgroundColor = '0x' + param.toString(16)

        this.maxPlayers = urlParams.get('maxPlayers') || 100;
        this.sideFlip = false;
        this.tileSize = 32;
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(+this.backgroundColor);
        this.allPlayers = {};
        this.addChat();
        this.loadAudios();
        this.cursor = this.input.keyboard.createCursorKeys();
        this.loadGame();
        this.tmpCounter = 0;
        this.infoPanel = Array(6).fill(this.add.bitmapText(0, 0, "mainFont", "", 0));
    }

    addChat () {
        this.chat = new Chat(this);
    }

    loadGame () {
        this.addMap();
        this.addUI();
        new Weather(this, "rain");
        this.setLightning();
        // this.playMusic();
    }

    addUI () {
        this.add.bitmapText(0, 0, "creep", "Zombie Night", 40).setOrigin(0,0).setTint(0xFFD700).setDropShadow(1, 1, 0xFFD700, 0.7);
        this.add.bitmapText(225, 0, "mainFont", "!join", 15).setOrigin(0).setTint(0xFFD700).setDropShadow(1, 1, 0xFFD700, 0.7);
        this.add.bitmapText(280, 0, "mainFont", "!x y", 15).setOrigin(0).setTint(0xFFD700).setDropShadow(1, 1, 0xFFD700, 0.7);
        this.add.bitmapText(225, 24, "mainFont", "!info", 15).setOrigin(0).setTint(0xFFD700).setDropShadow(1, 1, 0xFFD700, 0.7);
        this.add.bitmapText(280, 24, "mainFont", "!marco", 15).setOrigin(0).setTint(0xFFD700).setDropShadow(1, 1, 0xFFD700, 0.7);


        this.zombiesCountText =  this.add.bitmapText(400, 0, "creep", "ZOMBIES: 0", 25).setOrigin(0).setTint(0xFFD700).setDropShadow(1, 1, 0xFFD700, 0.7);
        this.humansCountText =  this.add.bitmapText(650, 0, "creep", "HUMANS: 0", 25).setOrigin(0).setTint(0xFFD700).setDropShadow(1, 1, 0xFFD700, 0.7);
        this.savedHumansCountText =  this.add.bitmapText(900, 0, "creep", "SAVED: 0", 25).setOrigin(0).setTint(0xFFD700).setDropShadow(1, 1, 0xFFD700, 0.7);
    }

    addMap () {
        this.gameLayer = this.add.layer();
        this.coverLayer = this.add.layer();
        const {width, heigth} = this.maxPlayers < 500 ? {width: 800, heigth: 600} : {width: 1200, heigth: 800};
        this.scenario = new Scenario(this.tileSize * 33, this.tileSize * 25)
        this.addChopper();
        this.cover = this.add.rectangle(0, 0, this.width, this.height, this.backgroundColor).setOrigin(0);
        this.coverLayer.add(this.cover)
    }


    addChopper() {
        this.chopper = new Chopper(this, 0, 0)
        const {x, y} = this.scenario.addChopper(this.chopper)
        this.chopper.x = x * this.tileSize;
        this.chopper.y = y * this.tileSize;
        this.gameLayer.add(this.chopper)
    }

    addPlayer (name) {
        if (this.allPlayers[name]) return;
        const player = this.chooseSide(name);
        this.updateScore();
        this.updateInfoPanel(`${player.name} joins the game as ${player.side}`)
    }

    chooseSide (name) {
        let player = null;
        let side = this.sideFlip ? "human" : "zombie";
        player = new Player(this, x, y, side, name);
        const {x, y} = this.scenario.addPlayer(player)
        player.x = x * this.tileSize;
        player.y = y * this.tileSize;
        this.allPlayers[name] = player;
        this.chat.say(`Player ${name} joins game as ${side}!`);
        console.log("Player added: ", player)
        this.sideFlip = !this.sideFlip;
        this.scenario.print();
        this.gameLayer.add(player)
        return player;
    }


    move (playerName, x, y) {
        const player = this.allPlayers[playerName];
        if (player instanceof Player === false) return;
        if (player.dead || player.saved) return;

        if (this.isValidXNumber(x) && this.isValidYNumber(y)) {
            const {movedX, movedY} = this.scenario.move(player, x, y)
            console.log(`Moving ${player.name} ${player.side} to ${x} ${y} - ${movedX} ${movedY}`)
            player.move(movedX, movedY)
            if (this.scenario.zombieInside(movedX, movedY)) {
                this.updateInfoPanel(`${player.name} becomes a zombie!!`)
                console.log("Zombie inside, player dies")
                player.die();
                this.updateScore();
            }

            if (this.scenario.chopperInside(movedX, movedY)) {
                console.log("Chopper inside, player is saved!")
                this.updateInfoPanel(`${player.name} reaches the chopper!!`)
                player.saved = true;
                this.updateScore();
            }
        } else {
            this.chat.say(`Player ${playerName} invalid attack values. Use speed: 0-100, angle: 0-360!`);
        }
    }

    marco (playerName) {
        const player = this.allPlayers[playerName];
        if (player instanceof Player === false) return;
        if (player.marcoUsed) return;
        this.updateInfoPanel("POLO!!")
        player.marcoUsed = true;
        console.log("Marco!")
        this.tweens.add({
            targets: this.cover,
            alpha: {from: 0, to: 1},
            duration: 3000
        })
        this.lightning.dewIt();
    }

    setLightning () {
        this.lightsOut = this.add.rectangle(0, 0, this.width + 200, this.height + 500, 0x0).setOrigin(0).setScrollFactor(0)
        this.lightsOut.setAlpha(0);
        this.lightningEffect = this.add.rectangle(0, 0, this.width + 200, this.height + 500, 0xffffff).setOrigin(0).setScrollFactor(0)
        this.lightningEffect.setAlpha(0);
        this.lightning = new Lightning(this);
        this.gameLayer.add(this.lightsOut);
        this.gameLayer.add(this.lightningEffect);
      }

    isValidXNumber(number) {
        return this.isValidNumber(number) && Math.abs(+number) >= 0 && Math.abs(+number)  <= 5;
    }

    isValidYNumber(number) {
        return this.isValidNumber(number) && Math.abs(+number)  >= 0 && Math.abs(+number)  <= 5;
    }

    info (playerName, playerToGetInfo) {
      const player = this.allPlayers[playerName];
      const playerInfo = this.allPlayers[playerToGetInfo];
      if (player && playerInfo) {
          const info = playerInfo.getInfo();
          return Object.keys(info).map(key => `${key} ${info[key]}`).join(", ");
      }
    }

    isValidNumber (number) {
        return !isNaN(number);
    }


    loadAudios () {
        this.audios = {
          "thunder0": this.sound.add("thunder0"),
          "thunder1": this.sound.add("thunder1"),
          "thunder2": this.sound.add("thunder2"),
          "thunder3": this.sound.add("thunder3"),
        };
      }

      playAudio(key) {
        this.audios[key].play();
      }

      playAudioRandomly(key) {
        const volume = Phaser.Math.Between(0.8, 1);
        const rate = Phaser.Math.Between(0.8, 1);
        this.audios[key].play({volume, rate});
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
        if (Phaser.Input.Keyboard.JustDown(this.cursor.down)) {
            this.addPlayer("devdiaries"+ this.tmpCounter);
            this.tmpCounter++;
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursor.left)) {
            this.move("devdiaries" + Phaser.Math.Between(0, this.tmpCounter), Phaser.Math.Between(-5, 5), Phaser.Math.Between(-5, 5));
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursor.right)) {
            this.marco("devdiaries"+ Phaser.Math.Between(0, this.tmpCounter));
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursor.up)) {
            this.showInfo("devdiaries"+ Phaser.Math.Between(0, this.tmpCounter));
        }
    }

    checkGameOver () {
        console.log(this.allPlayers, Object.values(this.allPlayers));
        const remaining = Object.values(this.allPlayers).map(player => player.side === "human").length;
  
        if (remaining <= 1) {
            this.winner = "No Winn"
            this.gameOver = true;
            this.showResult();
        }
    }

    showResult () {
        this.add.bitmapText(this.center_width, 80, "mainFont", "Game Over:", 30).setOrigin(0.5).setTint(0xFFD700).setDropShadow(1, 2, 0xbf2522, 0.7);

       console.log("ScoreBoard: ", scoreBoard[0].name)

       this.restart = this.add.bitmapText(this.center_width, this.height - 100, "mainFont", "CLICK TO RESTART", 30).setOrigin(0.5).setTint(0xFFD700).setDropShadow(1, 2, 0xbf2522, 0.7);
       this.restart.setInteractive();
       this.restart.on('pointerdown', () => {
            this.scene.start("splash")
        })
    }

    showInfo(playerName) {
        const player = this.allPlayers[playerName];
        const cell = this.scenario.findPlayerCell(player)
        this.updateInfoPanel(`${player.name} x: ${cell.x}, y: ${cell.y}`)
    }


    updateScore (points = 0) {
        const players = Object.values(this.allPlayers);
        const zombiesCount = players.filter(player => player.side === "zombie").length;
        this.zombiesCountText.setText("ZOMBIES: " + zombiesCount);
        const humansCount = players.filter(player => player.side === "human" && !player.saved).length;
        this.humansCountText.setText("HUMANS: " + humansCount);
        const savedHumansCount = players.filter(player => player.side === "human" && player.saved).length;
        this.savedHumansCountText.setText("SAVED: " + savedHumansCount);
    }

    updateInfoPanel (text) {
        this.infoPanel.pop().destroy();
        this.infoPanel.forEach((text, i) =>{ text.y += 32; })
        const addedText = this.add.bitmapText(0, 64, "creep", text, 25).setDropShadow(1, 1, 0xFFD700, 0.7);
        this.infoPanel.unshift(addedText);
        console.log("Info: ", this.infoPanel)
        this.tweens.add({
            targets: this.infoPanel[0],
            duration: 5000,
            alpha: {from: 1 , to: 0},
        })
    }
}
