import Player from "./player";
import { Debris } from "./particle";
import Platform from "./platform";
import Kitchen from "./kitchen";
import SpikeGenerator from "./spike_generator";
import Bat from "./bat";
import Spike from "./spike";
import Exit from "./exit";
import Conveyor from "./conveyor";
import { Explosion } from "./dust";

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }

    init (data) {
      this.name = data.name;
      this.number = data.number || 0;
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

      this.addPlayer();
      this.addConveyor();
      this.addSpikeGenerator();
      this.addKitchen();
      this.physics.world.enable([ this.player ]);
      this.loadAudios(); 
      this.addTimer();
    }

    addTimer() {
      this.registry.set("time", 0);

      this.timerText = this.add.bitmapText(this.center_width, 64, "celtic", "0", 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0.5)
      this.totalTime = 0;
      this.timer = this.time.addEvent({ delay: 1000, callback: this.addSecond, callbackScope: this, loop: true });
    }

    addSecond () {
      this.totalTime++;
      this.updateTimer()
    }

    updatePoints (points = 50) {
      this.totalTime += +points;
      console.log(this.totalTime, points)
      this.updateTimer()
    }

    createMap() {
      this.tileMap = this.make.tilemap({ key: "scene0" , tileWidth: 64, tileHeight: 64 });
      this.tileSetBg = this.tileMap.addTilesetImage("background");
      this.tileMap.createLayer('background', this.tileSetBg)
  
      this.tileSet = this.tileMap.addTilesetImage("softbricks");
      this.platform = this.tileMap.createLayer('scene' + this.number, this.tileSet);
      this.objectsLayer = this.tileMap.getObjectLayer('objects');

      this.platform.setCollisionByExclusion([-1]);

      this.platformGroup = this.add.group();
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
          this.add.bitmapText(object.x, object.y, "celtic", object.text.text, 30).setDropShadow(2, 4, 0x222222, 0.9).setOrigin(0)
        }

        if (object.name.startsWith("spike")) {
          const [name, rotation] = object.name.split(":")
          this.spikes.add(new Spike(this, object.x, object.y, name, rotation).setOrigin(0.5))
        }
      });
    }

    turnFoe (foe, platform) {
      foe.turn();
    }

    hitFloor() {

    }

    addPlayer() {
      this.elements = this.add.group();
      this.muffins = this.add.group();
      this.muffinTops = this.add.group();
      const playerPosition = this.objectsLayer.objects.find( object => object.name === "player")
      this.player = new Player(this, playerPosition.x, playerPosition.y, 0);

      this.physics.add.collider(this.player, this.platform, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.muffins, this.platform, this.muffinHitFloor, ()=>{
        return true;
      }, this);


      this.physics.add.collider(this.spikes, this.platform, this.spikeHitPlatform, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.platformGroup, this.hitFloor, ()=>{
        return true;
      }, this);
  
      this.physics.add.collider(this.player, this.muffins, this.hitMuffin, ()=>{
        return true;
      }, this);
        
      this.physics.add.collider(this.player, this.muffinTops, this.hitMuffinTop, ()=>{
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

      this.physics.add.overlap(this.muffins, this.spikes, this.muffinHitSpike, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.batGroup, this.hitPlayer, ()=>{
        return true;
      }, this);
    }

    spikeHitPlatform (spike, platform) {

    }

    muffinHitSpike (muffin, spike) {
      new Explosion(this, muffin.x, muffin.y, 10)
      if (muffin.muffinTop)  muffin.muffinTop.destroy();
      muffin.destroy();
      this.updatePoints(-25);
      this.cameras.main.shake(30);
    }

    hitMuffin (player, muffin) {
      console.log("Player hit muffinTop!", muffin);
    }
  
    hitMuffinTop (player, muffinTop) {
      player.createMuffin();
      new Explosion(this, muffinTop.x, muffinTop.y, 10)
      console.log("Player hit muffinTop!", muffinTop);
      muffinTop.setCompleted();
    }

    addConveyor() {
      this.conveyor = new Conveyor(this, 0, 800 - 100);
      this.physics.add.collider(this.player, this.conveyor, this.hiFloor, ()=>{
        return true;
      }, this);
      
      this.conveyor2 = new Conveyor(this, 0, 800 - 48, "conveyor", -1);

      this.physics.add.collider(this.muffins, this.conveyor, this.muffinHitFloor, ()=>{
        return true;
      }, this);
    }

    addSpikeGenerator () {
      this.spikeGenerator = new SpikeGenerator(this)
    }

    addKitchen () {
      this.kitchen = new Kitchen(this);
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

    muffinHitFloor (muffin, platform) {
      this.playAudio("land");
      muffin.body.setVelocityX(muffin.converyorSpeed);
      if (!muffin.body.blocked.down)
        new Explosion(this, muffin.x, muffin.y, 6)
    }

    hitFloor(player, platform) {
      if (this.player.jumping && this.player.body.velocity.y === 0) {
          player.landSmoke();
          this.playAudio("land");
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

    addPoints() {
      this.tweens.add({
        targets: this.timerText,
        duration: 100,
        scale: {from: 1.2, to: 1},
        repeat: 5
      })
      this.updatePoints();
    }

    updateTimer () {
      this.timerText.setText(this.totalTime + "$");
    }
}
