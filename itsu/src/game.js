import Brick from "./brick.js";
import Exit from "./exit.js";
import Bat from "./bat.js";
import Player from "./player.js";
import Spike from "./spike.js";

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
    }

    create () {
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      this.showingHints = false;

      this.loadAudios();
      // this.playMusic();

      this.createMap();
      this.addPlayer();
      this.addPause();
    }

    createMap() {
      this.paused = true;
      this.tileMap = this.make.tilemap({ key: "scene" + this.number , tileWidth: 64, tileHeight: 64 });
      this.tileSetBg = this.tileMap.addTilesetImage("background");
      this.tileMap.createLayer('background', this.tileSetBg)

      this.tileSet = this.tileMap.addTilesetImage("bricks");
      this.platform = this.tileMap.createLayer('scene' + this.number, this.tileSet);
      this.objectsLayer = this.tileMap.getObjectLayer('objects');

      this.platform.setCollisionByExclusion([-1]);

      this.platformGroup = this.add.group();
      this.bricks = this.add.group();
      this.exitGroup = this.add.group();
      this.spikes = this.add.group();
      this.batGroup = this.add.group();

      this.objectsLayer.objects.forEach( object => {

        if (object.name === "bat") {
          let bat = new Bat(this, object.x, object.y, object.type);
          this.batGroup.add(bat)
        }

        // if (object.name === "platform") {
        //   this.platformGroup.add(new Platform(this, object.x, object.y, object.type))
        // }

        if (object.name === "text") {
          this.add.bitmapText(object.x, object.y, "mario", object.text.text, 20).setDropShadow(2, 4, 0x222222, 0.9).setOrigin(0)
        }

        if (object.name.startsWith("brick")) {
          const [name, type, steps] = object.name.split(":");
          this.bricks.add(new Brick(this, object.x, object.y, "brick", type, steps))
        }

        if (object.name === "exit") {
          this.exitGroup.add(new Exit(this, object.x, object.y).setOrigin(0.5))
        }

        if (object.name === "spike") {
          this.spikes.add(new Spike(this, object.x, object.y))
        }
      });
    }

    addPlayer() {
      this.elements = this.add.group();

      const playerPosition = this.objectsLayer.objects.find( object => object.name === "player")
      this.player = new Player(this, playerPosition.x, playerPosition.y, 0);

      this.physics.add.collider(this.player, this.platform, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.batGroup, this.platform, this.turnFoe, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.platformGroup, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.bricks, this.hitPlatform, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.exitGroup, this.hitExit, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.spikes, this.hitPlayer, ()=>{
         return true;
      }, this);

      this.physics.add.overlap(this.player, this.batGroup, this.hitPlayer, ()=>{
        return true;
      }, this);
    }

    addPause() {
      this.pauseText1 = this.add.bitmapText(this.center_width, this.center_height - 80, "pixelFont", "PREST?", 100).setOrigin(0.5).setTint(0xf6ae2d)
      this.pauseText2 = this.add.bitmapText(this.center_width, this.center_height + 20, "pixelFont", "Sakatu ENTER hasteko", 50).setOrigin(0.5).setTint(0xf6ae2d)
      this.input.keyboard.on("keydown-ENTER", () => this.unPause(), this);
      this.input.keyboard.on("keydown-SPACE", () => this.unPause(), this);
    }

    hitPlatform(player, brick) {
      if (brick.type) {
        this.player.currentBlock = brick;
      }
      if (!this.showingHints) {
        this.showingHints = true;
        this.showHints()
      }

    }

    unPause() {
      this.paused = false;
      this.seconds = 0;
      this.playAudio("start");
      this.hideBlocks();
      this.input.keyboard.removeListener("keydown-ENTER");
      this.input.keyboard.removeListener("keydown-SPACE");
      this.pauseText1.destroy();
      this.pauseText2.destroy();
      this.showTimer()
    }

    showTimer() {
        this.seconds = 0;
        this.scoreText = this.add.bitmapText(this.center_width, 10, "pixelFont", this.seconds, 50).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0).setScrollFactor(0).setTint(0xf6ae2d)
        this.timer = this.time.addEvent({ delay: 1000, callback: this.updateTimer, callbackScope: this, loop: true });
    }

    updateTimer() {
      this.seconds++;
      this.scoreText.setText(this.seconds);
    }

    hideBlocks() {
      this.bricks.children.iterate( brick => {
        brick.setAlpha(0);
      })
    }


    showHints() {
      this.tweens.add({
        targets: this.bricks.children.entries,
        alpha: {from: 0, to: .2},
        duration: 100,
        yoyo: true,
        repeat: 2
      })
    }

    hitPlayer (player, foe) {
      if (!player.dead) {
        player.die();
        this.playAudio("death");
      }
    }

    hitExit(player, exit) {
      if (player.dead) return;
      this.player.stop()
      this.timer.remove();
      this.updateScore(this.seconds);
      this.playAudio("win");
      this.time.delayedCall(500, () => this.showCongrats(), null, this);
    }

    turnFoe (foe, platform) {
      foe.turn();
    }

    loadAudios () {
      this.audios = {
        "start": this.sound.add("start"),
        "jump": this.sound.add("jump"),
        "land": this.sound.add("land"),
        "death": this.sound.add("death"),
        "win": this.sound.add("win"),
        "step": this.sound.add("step"),
      };
    }

      playAudio(key) {
        this.audios[key].play();
      }

      playMusic (theme="game") {
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

    }

    showCongrats () {
      this.congratText1 = this.add.bitmapText(this.center_width, this.center_height - 80, "pixelFont", "ONA!!!", 100).setOrigin(0.5).setTint(0xf6ae2d)
      this.congratText2 = this.add.bitmapText(this.center_width, this.center_height + 20, "pixelFont", "Sakatu ENTER jarraitzeko!", 50).setOrigin(0.5).setTint(0xf6ae2d)
      this.input.keyboard.on("keydown-ENTER", () => this.finishScene(), this);
      this.input.keyboard.on("keydown-SPACE", () => this.finishScene(), this);
    }

    finishScene () {
      this.scene.start("transition", {number: this.number + 1});
    }

    restartScene () {
      this.time.delayedCall(1000, () => {
          if (this.theme) this.theme.stop();
          this.scene.start("transition", { name: "STAGE", number: this.number});
        },
        null,
        this
      );
    }

    updateScore (points = 0) {
        const score = +this.registry.get("seconds") + points;
        this.registry.set("seconds", score);
    }
}
