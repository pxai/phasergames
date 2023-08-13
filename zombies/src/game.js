import Player from "./player";
import Chat from "./chat";
import Scenario from "./scenario";
import Chopper from "./chopper";

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
        //this.loadAudios();
        this.cursor = this.input.keyboard.createCursorKeys();
        this.loadGame();
    }

    addChat () {
        this.chat = new Chat(this);
    }

    loadGame () {
        this.addMap();
        this.addUI();

        // this.playMusic();
    }

    addUI () {
        this.add.bitmapText(0, 0, "creep", "Zombie Night", 40).setOrigin(0,0).setTint(0xFFD700).setDropShadow(1, 1, 0xFFD700, 0.7);
        this.add.bitmapText(225, 0, "mainFont", "!join", 15).setOrigin(0).setTint(0xFFD700).setDropShadow(1, 1, 0xFFD700, 0.7);
        this.add.bitmapText(280, 0, "mainFont", "!x y", 15).setOrigin(0).setTint(0xFFD700).setDropShadow(1, 1, 0xFFD700, 0.7);
        this.add.bitmapText(330, 0, "mainFont", "!marco", 15).setOrigin(0).setTint(0xFFD700).setDropShadow(1, 1, 0xFFD700, 0.7);
    }

    addMap () {
        const {width, heigth} = this.maxPlayers < 500 ? {width: 800, heigth: 600} : {width: 1200, heigth: 800};
        this.scenario = new Scenario(this.tileSize * 10, this.tileSize * 10)
        this.addChopper();
    }


    addChopper() {
        this.chopper = new Chopper(this, 0, 0)
        const {x, y} = this.scenario.addChopper(this.chopper)
        this.chopper.x = x * this.tileSize;
        this.chopper.y = y * this.tileSize;
    }

    addPlayer (name) {
        const player = this.chooseSide(name);
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

        return player;
    }


    move (playerName, x, y) {
        const player = this.allPlayers[playerName];
        if (player instanceof Player === false) return;
        if (player.dead) return;

        if (this.isValidXNumber(x) && this.isValidYNumber(y)) {
            const {movedX, movedY} = this.scenario.move(player, x, y)
            console.log(`Moving ${player.name} ${player.side} to ${x} ${y} - ${movedX} ${movedY}`)
            player.move(movedX, movedY)
            if (this.scenario.zombieInside(movedX, movedY)) {
                console.log("Zombie inside, player dies")
                player.die();
            }
        } else {
            this.chat.say(`Player ${playerName} invalid attack values. Use speed: 0-100, angle: 0-360!`);
        }
    }

    marco (playerName) {
        const player = this.allPlayers[playerName];
        if (player instanceof Player === false) return;
        if (player.marcoUsed) return;

        player.marcoUsed = true;
        console.log("Marco!")
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
        if (Phaser.Input.Keyboard.JustDown(this.cursor.down)) {
            this.addPlayer("devdiaries");
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursor.left)) {
            this.move("devdiaries", Phaser.Math.Between(-5, 5), Phaser.Math.Between(-5, 5));
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursor.right)) {
            this.marco("devdiaries");
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


    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }
}
