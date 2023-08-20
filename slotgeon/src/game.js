import Player from "./player";
import Chat from "./chat";
import items from "./items";
import SlotMachine from "./slot";
import Character from "./character";
import Chest from "./chest";

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
        this.votingTime = +urlParams.get('votingTime') * 1000 || 5000;
        this.spinning = false;
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
        this.slot = new SlotMachine(Object.keys(items), "chest0");
        this.stopThisShit = false;
        this.generateCharacter();
        this.loadAudios();
    }

    addChat () {
        this.chat = new Chat(this);
    }

    loadGame () {
        this.addUI();
        // this.playMusic();
    }


    addUI () {
        this.itemDetails = this.add.group();
        this.overInfo = this.add.group()
       // this.add.rectangle(0, this.canvasPadding, this.width, this.height, this.canvasColor).setOrigin(0)
        this.add.bitmapText(0, 0, "mainFont", "Slotgeon", 20).setOrigin(0, 0.5).setTint(0xc9bf27).setDropShadow(1, 1, 0x540032, 0.7);

        this.add.rectangle(0, 32, 98, 32, 0x000000).setOrigin(0, 0.5).setAlpha(0.2);
        this.add.rectangle(0, 64, 98, 32, 0x000000).setOrigin(0, 0.5).setAlpha(0.5);
        this.add.rectangle(0, 96, 98, 32, 0x000000).setOrigin(0, 0.5).setAlpha(0.2);
        //this.chest = new Chest(this, 64, 196)
    }

    generateCharacter () {
        this.character = new Character(this, 0, 128, "knight").setOrigin(0, 0.5)
        this.infoGroup = this.add.group();
        this.showOverInfo(this.character.heroName.replace(" ", "\n") + "\n!slot to start");
        ["attack", "defense", "heart", "chest"].forEach((text, i) => {
            this.add.sprite(32 + (20 * i), 120, text).setOrigin(0.5).setScale(0.8)
        });
        [this.character.attack, this.character.defense, this.character.health, this.character.coins].forEach((text, i) => {
            this.infoGroup.add(this.add.bitmapText(32 + (20 * i), 128, "mainFont", text, 12).setOrigin(0.5).setTint(0xc9bf27).setDropShadow(1, 1, 0x540032, 0.7));
        })
    }

    updateCharacterInfo() {
        const values = [this.character.attack, this.character.defense, this.character.health, this.character.coins];
        this.infoGroup.getChildren().slice(0, 4).forEach((text,i) => {
            if (text) text.setText(values[i]);        
        });
    }

    addPlayer (name) {
        if (this.allPlayers[name]) return this.allPlayers[name];
        const player = new Player(name);

        this.allPlayers[name] = player;
        this.chat.say(`Player ${name} joins game!`);
        console.log("Player added: ", player)

        return player;
    }

    spin () {
        this.spinning = true;
        const totalRepeats = 20;
        let completedRepeats = 0;
        this.removeOverInfo()
        this.removeItemDetails()
        this.playAudio("slot")
        this.playAudio("reel")
        this.time.addEvent({
            delay: 200,
            callback: () => {
                this.slot.spin();
                this.paintSlot()
                completedRepeats++;
                if (completedRepeats === totalRepeats) {
                    this.time.delayedCall(200, () => { this.round() }, [], this);
                }
            },
            callbackScope: this,
            repeat: totalRepeats
        });
    }

    paintSlot () {
        this.cells = [[0,0,0],[0,0,0],[0,0,0]];
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
            [2, 1, 0].forEach((col, j) => {
                const cell = this.add.sprite(16 + (i * 32), 32 + (j * 32), this.slot.columns[col][row]).setOrigin(0.5);
                this.cells[i][j] = cell;
                this.slotsCells.add(cell);
                this.gameLayer.add(cell);
            });
        })
    }

    round (index = 0) {
        //this.infoGroup.setAlpha(0)
        this.showOverInfo("VOTE\n!run\n!fight\n!buy");
        this.getSlotResult();
        this.face(index)
        this.timeToVote = 10;
        this.countDown();
        this.time.delayedCall(this.votingTime, () => {
            this.runAction(this.calculateVotes());

        }, null, this)
    }

    runAction(votes) {
        this.timeToVoteText.setAlpha(0);
        this.selectedAction = this.areEmpty(votes) ? Phaser.Math.RND.pick(["run", "fight", "buy"]) : votes[0].action;

        if (this.selectedAction === "run") this.actionRun();
        if (this.selectedAction === "buy") this.actionBuy();
        if (this.selectedAction === "fight") this.actionFight();
        //this.checkGameOver();
        this.spinning = false;
    }

    actionRun () {
        this.playChicken();
        this.showOverInfo("RUN!\nlike a rat!")
        this.hit(2);
        this.updateCharacterInfo()
        this.time.delayedCall(3000, () => { if (!this.spinning) this.spin() }, null, this );
    }

    hit(points) {
        this.character.hit(points);
        this.playAudio("punch");
        this.updateCharacterInfo()
        this.cameras.main.shake(100 * points);
    }

    actionBuy () {
        this.showOverInfo("Go shopping!")
        console.log("Selected_", this.result)
        this.itemsToBuy = this.result.filter(item => !["enemy", "chest0"].includes(items[item].type) );
        if (this.itemsToBuy.length > 0) this.buyStuff();
        else this.goOn(1);
    }

    goOn(hitWith = 0) {
        console.log("Go on!")
        if (hitWith > 0) this.hit(hitWith);
        this.time.delayedCall(3000, () => { if (!this.spinning) this.spin() }, null, this );
    }

    buyStuff() {
        console.log("Buying stuff", this.itemsToBuy)
        this.itemsToBuy.forEach((item, i) => {
            this.time.delayedCall(1000 * i, () => { this.buyIt(item, this.itemsToBuy.length - 1 === i) }, null, this);
        })
    }

    buyIt(item, isLast) {
        const object = items[item];
        console.log("Buying ", this.character.coins, object.value)
        if (this.character.coins >= object.value) {
            this.playAudio("purchase")
            this.character.buy(object);
            this.showOverInfo(`${object.name}: ${object.value}$`, item)
            console.log("Bought ", object.name, object.value)
            this.updateCharacterInfo()
        }

        if (isLast) this.goOn();
    }

    actionFight () {
        this.showOverInfo("You chose violence!")
        console.log("Selected_", this.result)
        this.enemiesToFight = this.result.filter(item => items[item].type === "enemy");

        if (this.enemiesToFight.length > 0) this.fightStuff();
        else this.goOn(0);
    }


    fightStuff() {
        console.log("Fighting enemies", this.enemiesToFight)
        this.enemiesToFight.forEach((enemy, i) => {
            this.time.delayedCall(1000 * i, () => { this.fightIt(enemy, this.enemiesToFight.length - 1 === i) }, null, this);
        })
    }

    fightIt(enemy, isLast) {
        const foe = items[enemy];
        this.playAudio("sword")
        const attack = this.character.defense - foe.attack;
        console.log("fighting ", this.character.defense, foe.attack, " result: ", attack)
        this.hit(attack);
        this.showOverInfo(`Hit +${attack}`, enemy)
        this.updateCharacterInfo()

        if (isLast) this.goOn();
    }

    showInfo(message) {
        this.infoText.setText(message);
        this.tweens.add({
            targets: this.infoText,
            duration: 5000,
            ease: 'cubic',
            alpha: { from: 1, to: 0}
        })
    }

    areEmpty(votes) {
        return votes.every(vote => vote.total === 0);
    }

    countDown () {
        this.time.delayedCall(1000, () => {
            this.timeToVoteText.setText(this.timeToVote)
            if (this.timeToVote === 0) return;
            this.timeToVote--;
            this.countDown();
        }, null, this)
    }

    face(index) {
       // this.showInfo("Face: ", this.result[index])
        this.animate(index);

    }

    removeItemDetails () {
        if (this.itemDetails)  {
            this.itemDetails.getChildren().forEach(function(child) {
                child.destroy();
            }, this);
            this.itemDetails.clear(true, true);
        }
    }

    removeOverInfo () {
        console.log("Removing over info: ")
        if (this.overInfo)  {
            this.overInfo.getChildren().forEach(function(child) {
                child.destroy();
            }, this);
            this.overInfo.clear(true, true);
        }
    }

    animate (index) {
        const item = this.cells[index][1]
        item.setOrigin(0);
        this.tweens.add({
            targets: item,
            duration: 1000,
            x: {from: item.x, to: this.character.x},
            y: {from: item.y, to: this.character.y + 32 + (index * 32)},
            onComplete: () => {
                this.showItemDetail(item, this.character.x, this.character.y + 32 + (index * 32))
                if (index < 2) this.face(index + 1)
            }
        })
    }

    showItemDetail(item, x, y) {
        const itemInfo = items[item.texture.key];
        this.itemDetails.add(this.add.bitmapText(x, y - 16, "mainFont", itemInfo["name"], 12).setOrigin(0).setTint(0xc9bf27).setDropShadow(1, 1, 0x540032, 0.7));
        this.playAudio("pick");
        ["attack", "defense", "value"].forEach((value, i) => {
            this.itemDetails.add(this.add.bitmapText(x + 32 + (i * 20), y, "mainFont", itemInfo[value], 12).setOrigin(0.5).setTint(0xc9bf27).setDropShadow(1, 1, 0x540032, 0.7));
        })
    }

    showGeneralInfo(item, x, y) {
        const itemInfo = items[item.texture.key];
        this.itemDetails.add(this.add.bitmapText(x, y - 16, "mainFont", itemInfo["name"], 12).setOrigin(0).setTint(0xc9bf27).setDropShadow(1, 1, 0x540032, 0.7));

        ["attack", "defense", "value"].forEach((value, i) => {
            this.itemDetails.add(this.add.bitmapText(x + 32 + (i * 20), y, "mainFont", itemInfo[value], 12).setOrigin(0.5).setTint(0xc9bf27).setDropShadow(1, 1, 0x540032, 0.7));
        })
    }

    showOverInfo(message, sprite = null) {
        console.log("Showing over info: ", message, sprite)
        this.overRectangle = this.add.rectangle(0, 16, 98, 98, 0x000000).setAlpha(0.5).setOrigin(0)
        this.infoText = this.add.bitmapText(48, 90, "mainFont", "", 14).setOrigin(0.5).setTint(0xc9bf27).setDropShadow(1, 1, 0x540032, 0.7);
        this.timeToVoteText = this.add.bitmapText(48, 90, "mainFont", "", 18).setOrigin(0.5).setTint(0xc9bf27).setDropShadow(1, 1, 0x540032, 0.7);
        this.overTextTitle = this.add.bitmapText(48, 48, "mainFont", message, 14).setOrigin(0.5).setTint(0xc9bf27).setDropShadow(1, 1, 0x540032, 0.7)
        if (sprite) {
            this.timeToVoteText.setAlpha(0)
            this.overTextSprite = (sprite === "chest0") ? new Chest(this, 48, 90).setOrigin(0.5) : this.add.sprite(48, 90, sprite).setOrigin(0.5);
            if (sprite === "chest0") {
                this.playAudio("coins")
                this.overTextTitle.setText(`${this.overTextSprite.coins}$`)
                this.character.coins += this.overTextSprite.coins;
                this.updateCharacterInfo()
            }
            this.overInfo.add(this.overTextSprite);
        }

        this.overInfo.add(this.timeToVoteText);
        this.overInfo.add(this.overTextTitle);
        this.overInfo.add(this.overRectangle);
        this.overInfo.add(this.infoText);
    }

    getSlotResult () {
        this.result = [ this.slot.columns[1][0], this.slot.columns[1][1], this.slot.columns[1][2]];
    }

    isValidNumber (number) {
        return !isNaN(number);
    }

    loadAudios () {
        this.audios = {
            "punch": this.sound.add("punch"),
            "chicken": this.sound.add("chicken"),
            "sword": this.sound.add("sword"),
            "slot": this.sound.add("slot"),
            "reel": this.sound.add("reel"),
            "pick": this.sound.add("pick"),
            "purchase": this.sound.add("purchase"),
            "coins": this.sound.add("coins"),
        };
      }

      playAudio(key) {
        console.log("playing: ", key)
        this.audios[key].play();
      }

      playChicken(key = "chicken") {
        const soundDuration = this.audios[key].duration;
        const randomStartTime = Phaser.Math.FloatBetween(0, soundDuration);
        const randomDuration = Phaser.Math.FloatBetween(2, 3);
        const volume = Phaser.Math.Between(0.8, 1);
        const rate = Phaser.Math.Between(0.8, 1);
        this.audios[key].play({
            volume, rate,
            seek: randomStartTime,
            duration: randomDuration
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

        if (Phaser.Input.Keyboard.JustDown(this.cursor.right)) {
            console.log("Dale run")
            this.vote("devdiaries" + Phaser.Math.Between(0, this.height), "run");
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursor.left)) {
            console.log("Dale buy")
            this.vote("devdiaries" + Phaser.Math.Between(0, this.height), "buy");
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursor.up)) {
            console.log("Dale fight")
            this.vote("devdiaries" + Phaser.Math.Between(0, this.height), "fight");
        }
    }

    vote (playerName, vote) {
        if (vote === "slot" && !this.spinning)  {            
            this.spin();
        }
        console.log("Game> vote: ", playerName, vote)
        const player = this.addPlayer(playerName);
        console.log("Game> guess go on: ", player, player.vote, vote)
        player.vote = vote;
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

    resetPlayerVote () {
        Object.values(this.allPlayers).forEach(player => player.reset())
    }

    calculateVotes () {
        const players = [...Object.values(this.allPlayers)];
        const votes = [
            {action: "fight", total: players.filter(player => player.vote === "fight").length},
            {action: "run", total: players.filter(player => player.vote === "run").length},
            {action: "buy", total: players.filter(player => player.vote === "buy").length}
        ];
        votes.sort((votea, voteb) => voteb.total - votea.total);
        console.log(votes);
        return votes;
    }

    checkGameOver () {
        if (this.character.isDead()) {
            this.time.delayedCall(3000, () => {
                console.log("Life goes on!")
                this.generateCharacter();
            }, null, this)
        }
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
