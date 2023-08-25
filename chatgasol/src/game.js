import Player from "./player";
import Chat from "./chat";
import { Particle, Debris, Dust } from "./particle";
import Gasol from "./gasol";

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
        this.character = urlParams.get('channel').toLowerCase() === "niv3k_el_pato" ? "quack" : "gasol";
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;
        this.cameras.main.setBackgroundColor(+this.backgroundColor);
        this.physics.world.setBoundsCollision(true, true, true, true);
        this.mainColor = 0xF68815;
        this.addChat();
        this.loadAudios();
        this.addGameElements();
        this.addMap();
       // this.addHelp();
        this.addColliders ()
        this.cursor = this.input.keyboard.createCursorKeys();
    }

    addChat () {
        this.chat = new Chat(this);
    }

    addGameElements () {
        this.scores = this.add.group();
        this.clearScores()
        this.addGasol();
        this.addBasket();
        this.addColliders();
        this.playing = true;
    }

    addBasket () {
        const x = Phaser.Math.Between(128, this.width - 32);
        const y = Phaser.Math.Between(128, this.height/3);
        if (this.basket) {
            this.basket.destroy();
            this.table.destroy();
        } 
        this.table = this.add.image(x, y - 40, "table")
        this.basket = new Basket(this, x, y);
      }

    addGasol () {
        if (this.gasol) this.gasol.destroy();
        const {x, y} = {x: Phaser.Math.Between(32, this.width - 64), y: this.height - 32};
        this.gasol = new Gasol(this, x, y, this.character);
    }

    addHelp () {
        this.add.bitmapText(35, 65, "mainFont", "!speed angle", 20).setOrigin(0).setTint(this.mainColor).setDropShadow(1, 1, 0xbf2522, 0.7);
        this.add.bitmapText(35, 95, "mainFont", "!42 210", 20).setOrigin(0).setTint(this.mainColor).setDropShadow(1, 1, 0xbf2522, 0.7);
        // this.add.sprite(35, 80, "help").setScale(1).setOrigin(0).setTint(this.mainColor)
    }

    addMap () {
        this.batGroup = this.add.group();
        this.playerGroup = this.add.group();
        this.allPlayers = {};

        this.texts = [];
    }

    addColliders () {
        if (this.collider1) {
            this.collider1.destroy();
            this.collider2.destroy();
        }

        this.collider1 = this.physics.add.collider(this.playerGroup, this.basket, this.hitBasket, ()=>{
            return true;
          }, this);

        this.collider2 = this.physics.add.overlap(this.playerGroup, this.basket.entrance, this.gotcha, ()=>{
            return true;
          }, this);

        //   this.physics.add.collider(this.batGroup, this.physics.world.bounds.left, () => {
        //     this.turnFoe();
        //   }, null, this);

        //   this.physics.add.collider(this.batGroup, this.physics.world.bounds.right, () => {
        //     this.turnFoe();
        //   }, null, this);

        //   this.physics.add.collider(this.playerGroup, this.batGroup, this.hitBat, ()=>{
        //     return true;
        //   }, this);
    }

    hitBorder (point) {
        const {x, y} = point.center;
        console.log("What is this: ", x, y)
        new Dust(this, x, y)
    }

    hitBasket (ball, basket) {
        this.playAudio("boing")
        this.hit(ball.x, ball.y, 4)
        this.cameras.main.shake(30);
        this.tweens.add({
          targets: [basket],
          x: "-=5",
          yoyo: true,
          duration: 30,
          repeat: 10
        })
      }

    gotcha (player) {
        if (player && player.dead) return;
        console.log("This is the player: ", player)
        this.playAudio(this.character === "quack" ? "quack" : "gotcha")
        this.gasol.celebrate();
        this.basket.anims.play("basket", true);
        player.addPoints();
        player.die();
        this.textYAY1 = this.add.bitmapText(this.center_width, this.center_height, "mainFont",  player.name, 40).setTint(this.mainColor).setOrigin(0.5).setDropShadow(1, 2, 0xffffff, 0.9);
        this.textYAY2 = this.add.bitmapText(this.center_width, this.center_height + 50, "mainFont",  " +3 points!", 40).setTint(0x539DDB).setOrigin(0.5).setDropShadow(1, 2, 0xffffff, 0.9);
        this.scores.add(this.textYAY1, this.textYAY2)
        this.showResult();
    }

    hitBat(ball, bat) {
        //this.playAudio("boing")
        this.hit(ball.x, ball.y)
        bat.turn();
      }

      turnFoe (foe, platform) {
        foe.turn();
      }


      hit (x, y, total = 10) {
        Array(Phaser.Math.Between(4, total)).fill(0).forEach((_,i) => {
          x += Phaser.Math.Between(-10, 10);
          y += Phaser.Math.Between(-10, 10);
          new Dust(this, x, y);
        })
      }

    attack (playerName, speed, angle) {
        if (!this.playing) return;
        let player = this.allPlayers[playerName];
        console.log("Ball: ", playerName, speed, angle, player,  " Instance? ", player instanceof Player)
        if (!player) {
            console.log("Here we go!")
            player = new Player(this, this.gasol.x, this.gasol.y - 48, playerName);
            this.playerGroup.add(player);
            this.allPlayers[playerName] = player;
            this.chat.say(`Player ${playerName} joins game!`);
        } else if (player.dead) {
            player.reborn();
            console.log("Player back")
        } else {
            console.log("Wait a bit")
            return;
        }

        if (player.dead) return;

        if (this.isValidNumber(speed) && this.isValidNumber(angle)) {
            this.gasol.anims.play("playershot", true)
            const finalAngle = Phaser.Math.DegToRad(+angle);
            const velocity = this.physics.velocityFromRotation(finalAngle, (+speed*10));
            player.body.setVelocity(velocity.x, velocity.y);
            this.time.delayedCall(5000, () => { this.removePlayer(player)}, null, this)
            //this.playAudio("fireball")
        } else {
            this.chat.say(`Player ${playerName} invalid throw values. Use speed: 0-100, angle: 0-360!`);
        }
    }

    removePlayer(player) {
        console.log("Removing player")
        new Dust(this, player.x, player.y)
        player.die();
    }

    isValidSpeed(number) {
        return this.isValidNumber(number) && +number >= 0 && +number <= 100;
    }

    isValidAngle(number) {
        return this.isValidNumber(number) && +number >= 0 && +number <= 360;
    }

    isValidNumber (number) {
        return !isNaN(number) && number >= 0 && number < this.width;
    }

    isValidRange (number, range) {
        return this.isValidNumber(number) && number >= 0 && number <= range;
    }

    loadAudios () {
        this.audios = {
          "boing": this.sound.add("boing"),
          "gotcha": this.sound.add("gotcha"),
          "marble": this.sound.add("marble"),
          "win": this.sound.add("win"),
          "break": this.sound.add("break"),
          "start": this.sound.add("start"),
          "quack": this.sound.add("quack"),
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
        // if (Phaser.Input.Keyboard.JustDown(this.cursor.up)) {
        //     this.attack("devdiaries", Phaser.Math.Between(0, 100), Phaser.Math.Between(180, 360));
        // }

        // if (Phaser.Input.Keyboard.JustDown(this.cursor.left)) {
        //     this.attack("devdiaries" + Phaser.Math.Between(0, 100), Phaser.Math.Between(0, 100), Phaser.Math.Between(180, 360));
        // }

        // if (Phaser.Input.Keyboard.JustDown(this.cursor.down)) {
        //     this.gotcha(this.allPlayers["devdiaries"])
        // }
    }

    showResult () {
        this.playing = false;
        const scoreBoard = this.createScoreBoard()

        console.log("ScoreBoard: ", scoreBoard)
        this.scores.add(this.add.bitmapText(8, 8, "mainFont", "Chat Gasol - Scoreboard", 35).setOrigin(0).setTint(0x539DDB).setDropShadow(.5, .5, 0xffffff, 0.7));
        scoreBoard.slice(0, 5).forEach((player, i) => {
            const winnerText = `${i+1}.  ${player.name.substring(0, 11)}:  ${player.points}`;
            this.scores.add(this.add.bitmapText(20, 45 + (i * 40), "mainFont", winnerText, 35).setOrigin(0).setTint(this.mainColor).setDropShadow(0.5, .5, 0xffffff, 0.7));
        })

        this.tweens.add({
            targets: [this.textYAY1, this.textYAY2],
            duration: 4000,
            alpha: {from: 1, to: 0},
            onComplete: () => {
                this.clearScores();
            }
        })

        this.time.delayedCall(4000, () => {
            this.addGameElements();
        }, null, this)
    }

    clearScores () {
        this.scores.getChildren().forEach(function(child) {
            child.setText("")
            child.destroy();
        }, this);
        this.scores.clear(true, true);
    }

    createScoreBoard () {
        return [...Object.values(this.allPlayers)].sort((player1, player2) => player2.points - player1.points);
    }
}


export class Ball extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, scale = 0.8) {
        super(scene, x, y, "ball")
        this.setScale(0.8)
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        this.body.setCircle(15);
        this.body.setBounce(1)
        //this.body.setOffset(6, 9)
        this.body.setAllowGravity(true);
        this.init();
    }

    init () {

      this.scene.anims.create({
        key: "ball",
        frames: this.scene.anims.generateFrameNumbers("ball", { start: 0, end: 3 }),
        frameRate: 8,
        repeat: -1
      });

      this.anims.play("ball", true);
      this.scene.tweens.add({
          targets: this,
          duration: 200,
          rotation: "+=1",
          repeat: -1
      });
    }
  }

  class Basket extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, bounce = 0.5) {
        super(scene, x, y, "basket")
        scene.add.existing(this)
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        this.body.setSize(48, 6)
        const offset = scene.number === 1 ? -20 : 5
        this.entrance = this.scene.add.rectangle(x, this.body.y + 32, 40, 6, 0xffffff).setAlpha(0);
        scene.physics.add.existing(this.entrance);
        this.body.setImmovable(true)
        this.body.setAllowGravity(false);
        this.entrance.body.setAllowGravity(false);
        this.init();
      }

      init () {

        this.scene.anims.create({
          key: "basket",
          frames: this.scene.anims.generateFrameNumbers("basket", { start: 0, end: 8 }),
          frameRate: 15,
        });
      }
  }
