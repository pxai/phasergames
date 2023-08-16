import Player from "./player";
import Chat from "./chat";
import items from "./items";
import SlotMachine from "./slot";

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
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(+this.backgroundColor);
        this.allPlayers = {};
        this.infoPanel = Array(6).fill(this.add.bitmapText(0, 0, "mainFont", "", 0));
        this.addChat();
        this.loadAudios();
        this.cursor = this.input.keyboard.createCursorKeys();
        this.loadGame();
        this.tmpCounter = 0;
        this.slot = new SlotMachine(Object.keys(items));
        this.stopThisShit = false;
    }

    addChat () {
        this.chat = new Chat(this);
    }

    loadGame () {
        this.addUI();
        // this.playMusic();
    }


    addUI () {

       // this.add.rectangle(0, this.canvasPadding, this.width, this.height, this.canvasColor).setOrigin(0)
        this.add.bitmapText(0, 0, "mainFont", "Brushkkake", 20).setOrigin(0).setTint(0xc9bf27).setDropShadow(1, 1, 0x540032, 0.7);
        this.add.bitmapText(130, 10, "mainFont", `${this.width}x${this.height - 20}`, 12).setOrigin(0).setTint(0xc9bf27).setDropShadow(1, 1, 0x540032, 0.7);
        this.add.bitmapText(210, 10, "mainFont", "!x y color size", 12).setOrigin(0).setTint(0xc9bf27).setDropShadow(1, 1, 0x540032, 0.7);
    }

    addPlayer (name) {
        if (this.allPlayers[name]) return this.allPlayers[name];
        const player = new Player(name);

        this.allPlayers[name] = player;
        this.chat.say(`Player ${name} joins game!`);
        console.log("Player added: ", player)

        return this.player;
    }

    spin () {
        const totalRepeats = 20;
        let completedRepeats = 0;
        this.counter = 0;

        this.time.addEvent({
            delay: 500,
            callback: () => {
                console.log("Spinning")
                this.slot.spin();
                this.paintSlot()
                completedRepeats++;
                if (completedRepeats === totalRepeats) {
                    this.getSlotResult();
                }
            },
            callbackScope: this,
            repeat: totalRepeats
        });
    }

    paintSlot () {
        if (this.slotsCells) {
            // this.scores.getChildren().forEach(function(child) {
            //     child.destroy();
            // }, this);
            this.slotsCells.clear(true, true);
        } else {
            this.gameLayer = this.add.layer();
            this.slotsCells = this.add.group();
        }

        [0, 1, 2].forEach((row, i) => {
            [0, 1, 2].forEach((col, j) => {
                const cell = this.add.sprite(i * 32, j * 32, this.slot.columns[i][j]).setOrigin(0);
                this.slotsCells.add(cell);
                this.gameLayer.add(cell);
            });
        })
    }

    getSlotResult () {
        this.result = this.slot.columns.map(column => items[column[1]]);
        console.log("Result: ", this.result)
    }


    paint (playerName, x, y, color = "#000000", size = 4) {
        return;
        if (this.stopThisShit) return;
        const player = this.addPlayer(playerName);
        if (!player) return;

        if (this.isValidXNumber(x) && this.isValidYNumber(y) && this.isValidColor(color) && this.isValidSize(size)) {
            if (this.mode === "pixelArt") {
                this.add.rectangle(x, y + this.canvasPadding, this.pixelArtSize, this.pixelArtSize, this.rgbtoHex(color));
            } else {
                this.add.circle(x, y + this.canvasPadding, size, this.rgbtoHex(color));
            }

            console.log(`Painting ${player.name}to ${x} ${y} ${color} mode: ${this.mode}`)
        } else {
            this.chat.say(`Player ${playerName} invalid attack values. Use speed: 0-100, angle: 0-360!`);
        }
    }

    isValidXNumber(number) {
        return this.isValidNumber(number) && Math.abs(+number) >= 0 && Math.abs(+number)  <= this.width;
    }

    isValidYNumber(number) {
        return this.isValidNumber(number) && Math.abs(+number)  >= 0 && Math.abs(+number)  <= this.height;
    }

    isValidSize(number) {
        return this.isValidNumber(number) && Math.abs(+number)  >= 1 && Math.abs(+number)  <= this.maxSize;
    }

    isValidColor(color) {
        console.log("CSS supports color: ", "color", CSS.supports(color))
        return CSS.supports("color", color)
    }

    rgbtoHex(color) {
        return parseInt(color.substring(1), 16);
    }

    isValidNumber (number) {
        return !isNaN(number);
    }


    loadAudios () {
        this.audios = {
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
            this.spin();
        }

        // if (Phaser.Input.Keyboard.JustDown(this.cursor.left)) {
        //     console.log("Dale")
        //     this.paint("devdiaries", Phaser.Math.Between(0, this.height), Phaser.Math.Between(0, this.height));
        // }

        // if (Phaser.Input.Keyboard.JustDown(this.cursor.right)) {
        //     this.paint("devdiaries", Phaser.Math.Between(0, this.height), Phaser.Math.Between(0, this.height));
        // }

        // if (Phaser.Input.Keyboard.JustDown(this.cursor.up)) {
        //     this.paint("devdiaries", Phaser.Math.Between(0, this.height), Phaser.Math.Between(0, this.height));
        // }
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

    updateInfoPanel (text) {
        this.infoPanel.pop().destroy();
        this.infoPanel.forEach((text, i) =>{ text.y += 32; })
        const addedText = this.add.bitmapText(0, 64, "mainFont", text, 25).setDropShadow(1, 1, 0xFFD700, 0.7);
        this.infoPanel.unshift(addedText);
        console.log("Info: ", this.infoPanel)
        this.tweens.add({
            targets: this.infoPanel[0],
            duration: 5000,
            alpha: {from: 1 , to: 0},
        })
    }
}
