import { Particle, Debris, Dust } from "./particle2";
import Coin from "./coin";
import Player from "./player";
import Exit from "./exit";
import Sky from "./sky";
import GustGenerator from "./gust_generator";

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }

    init (data) {
      this.name = data.name;
      this.number = data.number;
  }

    preload () {
      this.score = 0;
    }

    create () {
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;

      this.cameras.main.setBackgroundColor(0x4eadf5);

      this.lines = this.add.group();
      this.loadAudios();
      this.cloudLayer = this.add.layer();
      this.pointer = this.input.activePointer;
      this.trailLayer = this.add.layer();

      this.addMap();
      this.addPlayer();

      this.addSky();
      this.showStage();
      this.addScore();
      this.addGusts();
      this.finished = false;
       this.ready = true;
     //  this.input.keyboard.on("keydown-SPACE", () => this.finishScene(), this); // TODO REMOVE
       //this.playAudio("start", 0.5)
       this.pickedCoins = 0;
    }

    addSky() {
      this.sky = new Sky(this);
  }
    addGusts () {
      this.gustsGenerator = new GustGenerator(this);
    }

    addMap () {
      this.tileMap = this.make.tilemap({ key: "scene" + this.number , tileWidth: 32, tileHeight: 32 });
      this.tileSet = this.tileMap.addTilesetImage("tileset");
      this.platform = this.tileMap.createLayer('scene' + this.number, this.tileSet);


      this.objectsLayer = this.tileMap.getObjectLayer('objects');
      this.batGroup = this.add.group();
      this.foesGroup = this.add.group();
      this.coins= this.add.group();
      this.exits = this.add.group();
      this.gusts = this.add.group();

      this.playerPosition = this.objectsLayer.objects.find( object => object.name === "player")

      this.physics.world.bounds.setTo(0, 0, this.tileMap.widthInPixels, this.tileMap.heightInPixels);
      this.platform.setCollisionByExclusion([-1]);

      this.objectsLayer.objects.forEach( object => {
        if (object.name === "coin") {
          this.coins.add(new Coin(this, object.x, object.y));
        }

        if (object.name === "exit") {
          this.exits.add(new Exit(this, object.x, object.y));
        }
      });
    }

    addPlayer () {
        const velocities = [200, 250, 300, 350]
        const playerPosition = this.objectsLayer.objects.find( object => object.name === "player")
        this.player = new Player(this, playerPosition.x, playerPosition.y);
        this.players = this.add.group();
        this.players.add(this.player)


        this.physics.add.collider(this.players, this.physics.world.bounds.bottom, () => {
          this.death();
        }, null, this);

        this.physics.add.collider(this.players, this.platform, this.hitFloor, ()=>{
          return true;
        }, this)

        this.physics.add.collider(this.players, this.gusts, this.pushPlayer, ()=>{
          return true;
        }, this)

        this.physics.add.overlap(this.players, this.coins, this.pickCoin, ()=>{
          return true;
        }, this);


        this.physics.add.overlap(this.players, this.exits, this.hitExit, ()=>{
          return true;
        }, this);

        //this.cameras.main.startFollow(this.player, false, 1, 0);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setFollowOffset( 0, -100);
        this.player.dead = false;
    }

    hitPlatform (player, platform) {

    }

    pushPlayer (player, gust) {
    }

    hitFloor (ball, platform) {
      if ([3, 4, 5, 6].includes(platform.index)) {
        this.playRandom("break")
        this.hit(ball.x, ball.y)
        Array(Phaser.Math.Between(4, 8)).fill(0).forEach( i => new Debris(this, platform.pixelX, platform.pixelY, 0xb95e00))
      }
    }

    pickCoin (player, coin) {
      this.playAudio("coin")

      this.showPoints(player.x, player.y, "+1", 0xffffff)
      coin.destroy();
      this.updateCoins();
    }


    playRandom(key) {
      this.audios[key].play({
        rate: Phaser.Math.Between(9, 11)/10,
        volume: Phaser.Math.Between(5, 10)/10,
        delay: 0
      });
    }

    showPoints (x, y, msg, color = 0xff0000) {
      let text = this.add.bitmapText(x + 20, y - 80, "pico", msg, 15).setDropShadow(1, 2, color, 0.7).setOrigin(0.5);
      this.tweens.add({
          targets: text,
          duration: 1000,
          alpha: {from: 1, to: 0},
          x: {from: text.x + Phaser.Math.Between(-10, 10), to: text.x + Phaser.Math.Between(-40, 40)},
          y: {from: text.y - 10, to: text.y - 60},
          onComplete: () => {
              text.destroy()
          }
      });
    }

    showStage() {
      this.text1 = this.add.bitmapText(this.width - 128, 50, "demon", "STAGE " + this.number, 20).setOrigin(0.5).setDropShadow(0, 4, 0x222222, 0.9).setScrollFactor(0);
    }

    addScore() {
      this.scoreCoins = this.add.bitmapText(75, 10, "demon", "x0", 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0).setScrollFactor(0)
      this.scoreCoinsLogo = this.add.sprite(50, 25, "coin").setScale(0.6).setOrigin(0.5).setScrollFactor(0)
      const coinAnimation = this.anims.create({
        key: "coinscore",
        frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 7 }, ),
        frameRate: 8,
      });
      this.scoreCoinsLogo.play({ key: "coinscore", repeat: -1 });
    }

      loadAudios () {
        this.audios = {
          "boing": this.sound.add("boing"),
          "gotcha": this.sound.add("gotcha"),
          "explosion": this.sound.add("explosion"),
          "win": this.sound.add("win"),
          "break": this.sound.add("break"),
          "start": this.sound.add("start"),
          "coin": this.sound.add("coin"),
        };
      }

      playAudio(key, volume = 1) {
        this.audios[key].play({volume});
      }

      playMusic (theme="theme") {
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
      })
      }

    update() {
      if (this.player && Phaser.Math.Between(1, 5) > 4) {

        this.trailLayer.add(new Particle(this, this.player.x, this.player.y, 0xb95e00));
      }

      if (this.finished) {
        let color =  0xb95e00;
        new Particle(this, Phaser.Math.Between(0, this.width),Phaser.Math.Between(0, this.height), color, Phaser.Math.Between(4, 10));
      }
    }

    hit (x, y, total = 10) {
      this.playAudio("break")
      this.playAudio("explosion")
      this.death();
      Array(Phaser.Math.Between(4, total)).fill(0).forEach((_,i) => {
        x += Phaser.Math.Between(-10, 10);
        y += Phaser.Math.Between(-10, 10);
        new Dust(this, x, y);
      })
    }

    destroyRectangle () {
      if (this.rectangle0) {
        this.rectangle0.destroy();
       }
    }

    pickRandomMessage () {
      return Phaser.Math.RND.pick(["COMPLETED!", "WELL DONE!", "NICE!", "GREAT!", "AWESOME!", "AMAZING!", "FANTASTIC!", "INCREDIBLE!"])
    }

    hitExit () {
      this.playAudio("gotcha")
      this.player.destroy();
      const x = this.cameras.main.worldView.centerX;
      const y = this.cameras.main.worldView.centerY;
      this.textYAY = this.add.bitmapText(x, y, "demon", this.pickRandomMessage(), 80).setOrigin(0.5).setDropShadow(0, 8, 0x222222, 0.9);
      this.time.delayedCall(2000, () => { this.finishScene();}, null, this);
    }

    finishScene () {
      const coins = +this.registry.get("coins") + this.pickedCoins;
      this.registry.set("coins", coins);
      if (this.number < 3) {
        this.game.sound.stopAll();
        this.number++;
        this.scene.start("transition", {number: this.number});
      } else {
        this.game.sound.stopAll();
        this.finished = true;

        this.playAudio("win")

        const x = this.cameras.main.worldView.centerX;
        const y = this.cameras.main.worldView.centerY;
        this.text3 = this.add.bitmapText(x, y + 50, "demon", "Coins: " + this.registry.get("coins"), 45).setOrigin(0.5).setDropShadow(0, 8, 0x222222, 0.9).setScrollFactor(0);;
        this.text4 = this.add.bitmapText(x, y - 50, "demon", "CONGRATULATIONS!", 35).setOrigin(0.5).setDropShadow(0, 5, 0x222222, 0.9).setScrollFactor(0);;
        this.time.delayedCall(4000, () => {
          this.text3.destroy()
          this.text4.destroy()
          this.scene.start("outro");
        });
      }
     }

    updateHits () {
      let hits = +this.registry.get("hits");
      hits++;
      this.registry.set("hits", hits)
      this.textHits.setText("HITS: " + this.registry.get("hits"))
    }

    death() {
      this.player.destroy()
      this.cameras.main.shake(100);
      this.textBOO = this.add.bitmapText(this.center_width, this.center_height, "demon", "FAIL", 80).setOrigin(0.5).setDropShadow(0, 8, 0x222222, 0.9);

      this.time.delayedCall(1000, () => {
        this.textBOO.destroy();
        this.scene.start("game", {number: this.number});
      });
    }

    updateCoins () {
      this.pickedCoins++;
      this.scoreCoins.setText("x"+this.pickedCoins);
      this.tweens.add({
        targets: [this.scoreCoinsLogo],
        scale: { from: 1, to: 0.6},
        duration: 50,
        repeat: 10
      })
    }
}


