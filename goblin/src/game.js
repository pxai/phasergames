import Player from "./player";
import { Debris } from "./particle";
import Platform from "./platform";
import Turn from "./turn";
import Bat from "./bat";
import Spike from "./spike";
import Exit from "./exit";
import Brick from "./brick";

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
      this.cameras.main.setBackgroundColor(0x000000)
      // this.add.tileSprite(0, 1000, 1024 * 10, 512, "landscape").setOrigin(0.5);
      this.createMap();

      this.cameras.main.setBounds(0, 0, 20920 * 2, 20080 * 2);
      this.physics.world.setBounds(0, 0, 20920 * 2, 20080 * 2);
      this.addPlayer();

      this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 0);
      this.physics.world.enable([ this.player ]);
      this.loadAudios(); 
      this.addTimer();
    }

    addTimer() {
      this.registry.set("time", 0);
      this.exitText = this.add.bitmapText(100, 32, "mario", Math.round(this.player.y) + " m.", 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0).setScrollFactor(0)

      this.timerText = this.add.bitmapText(this.center_width, 32, "mario", "0", 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0).setScrollFactor(0)
      this.totalTime = 0;
      this.timer = this.time.addEvent({ delay: 1000, callback: this.addSecond, callbackScope: this, loop: true });
    }

    addSecond () {
      this.totalTime++;
      this.updateTimer()
    }

    createMap() {
      this.tileMap = this.make.tilemap({ key: "scene0" , tileWidth: 64, tileHeight: 64 });
      this.tileSetBg = this.tileMap.addTilesetImage("background");
      this.tileMap.createStaticLayer('background', this.tileSetBg)
  
      this.tileSet = this.tileMap.addTilesetImage("softbricks");
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

        if (object.name === "platform") {
          this.platformGroup.add(new Platform(this, object.x, object.y, object.type))
        }

        if (object.name === "text") {
          this.add.bitmapText(object.x, object.y, "mario", object.text.text, 30).setDropShadow(2, 4, 0x222222, 0.9).setOrigin(0)
        }

        if (object.name === "brick") {
          this.bricks.add(new Brick(this, object.x, object.y))
        }

        if (object.name === "exit") {
          this.exitGroup.add(new Exit(this, object.x, object.y).setOrigin(0.5))
        }
      });
      this.time.delayedCall(3000, () =>{
        this.objectsLayer.objects.forEach( object => {
          if (object.name === "spike") {
            this.spikes.add(new Spike(this, object.x, object.y))
          }
        })
      }, null, this)
    }

    regenerate(x, y) {
      this.time.delayedCall(Phaser.Math.Between(1000, 3000), () => {
        this.bricks.add(new Brick(this, x, y))
      }, null, this)
    }

    turnFoe (foe, platform) {
      foe.turn();
    }


    hitFloor() {

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
  
      this.physics.add.collider(this.player, this.bricks, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.exitGroup, () => { 
        this.playAudio("stage");
        this.time.delayedCall(500, () => this.finishScene(), null, this);
      }, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.spikes, this.hitPlayer, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.batGroup, this.hitPlayer, ()=>{
        return true;
      }, this);
    }

    turnFoe (foe, platform) {
      foe.turn();
    }

    hitPlayer(player, foe) {
      if (!player.dead) {
        player.die();
        this.playAudio("death");
      }
    }

    blowPlatform (blow, platform) {
      const tile = this.getTile(platform)
      if (this.isBreakable(tile)) {
        this.playAudioRandomly("stone_fail");
        this.playAudioRandomly("stone");
        if (this.player.mjolnir) this.cameras.main.shake(30);
        blow.destroy();
        Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this, tile.pixelX, tile.pixelY))
        this.platform.removeTileAt(tile.x, tile.y);

      } 
    }



    hitFloor(player, platform) {
      if (this.player.jumping && this.player.falling && platform.name === "question" && this.player.body.velocity.y === 0) {
        if (!platform.activated) { 
          player.landSmoke();
          this.playAudio("land");
          platform.activate();
          player.currentBlock = platform;
        }
      }
    }

      loadAudios () {
        this.audios = {
          "build": this.sound.add("build"),
          "death": this.sound.add("death"),
          "jump": this.sound.add("jump"),
          "kill": this.sound.add("kill"),
          "land": this.sound.add("land"),
          "lunchbox": this.sound.add("lunchbox"),
          "prize": this.sound.add("prize"),
          "stone_fail": this.sound.add("stone_fail"),
          "stone": this.sound.add("stone"),
          "foedeath": this.sound.add("foedeath"),
          "stage": this.sound.add("stage"),
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

    update() {
      this.player.update();
      if (this.number === 3 && this.player.y > 1500) this.restartScene();
    }

    finishScene () {
      this.registry.set("time", this.totalTime)
      if (this.theme) this.theme.stop();
      this.scene.start("outro", { name: "STAGE", number: this.number + 1});
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

    updateTimer () {
      this.updateExit()
      this.timerText.setText(this.totalTime);
    }

    updateExit () {
      this.exitText.setText(Math.round(this.player.y) + " m.");
    }
}
