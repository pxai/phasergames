import Player from "./player";
import Exit from "./exit";
import Checkpoint from "./checkpoint";
import Volcano from "./volcano";
import WaterVolcano from "./water_volcano";
import { Gold } from "./particle";
import Mine from "./mine";
import Fish from "./fish";
import HealthBar from "./health_bar";
import Explosion from "./explosion";
import { Bubble } from "./bubble";

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
      this.trailLayer = this.add.layer();
      this.cameras.main.setBackgroundColor(0x000000);

      this.addMap();
      this.showTexts();
      this.addPlayer();
      this.addLight();
      this.addScore();
      this.loadAudios(); 
      this.sceneIsOver = false;
      this.playMusic();
    }

    addScore() {
      this.registry.set("golds", 0);
      this.scoreEmber = this.add.bitmapText(75, 20, "pixelFont", "x0", 15).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0).setScrollFactor(0)
      this.scoreEmberLogo = this.add.sprite(50, 25, "gold0").setOrigin(0.5).setScrollFactor(0)
      this.tweens.add({
        targets: this.scoreEmberLogo,
        duration: 300,
        repeat: -1,
        scale: {from: 0.95, to: 1},
        yoyo: true
    })
    }

    addHealth () {
      this.emptyHealth = null;
      const seconds = 20 * (this.number + 1)
      this.healthBar = new HealthBar(this, this.center_width, 32, seconds).setScrollFactor(0).setOrigin(0.5)
    }

    addLight() {
      this.lights.enable();
      this.lights.setAmbientColor(0x0d0d0d);
      this.playerLight = this.lights.addLight(0, this.player.health * 5, this.player.health * 5).setColor(0xffffff).setIntensity(3.0);
    }

    addMap() {
      this.fireballs = this.add.group();
      this.tileMap = this.make.tilemap({ key: `scene${this.number}` , tileWidth: 32, tileHeight: 32 });
      this.tileSetBg = this.tileMap.addTilesetImage("cave");
      this.tileMap.createStaticLayer('background', this.tileSetBg).setPipeline('Light2D');
  
      this.tileSet = this.tileMap.addTilesetImage("cave");
      this.platform = this.tileMap.createLayer(`scene${this.number}`, this.tileSet).setPipeline('Light2D');;
      this.objectsLayer = this.tileMap.getObjectLayer('objects')
      this.platform.setCollisionByExclusion([-1]);

      this.exits = this.add.group();
      this.bubbles = this.add.group();
      this.golds = this.add.group();
      this.emberHeads = this.add.group();
      this.volcanos = this.add.group();
      this.waterVolcanos = this.add.group();
      this.volcanoShots = this.add.group();
      this.brokenBlocks = this.add.group();
      this.checkpoints = this.add.group();
      this.fireballs = this.add.group();
      this.mines = this.add.group();
      this.fish = this.add.group();
      this.texts = [];
      this.objectsLayer.objects.forEach( object => {
        if (object.name.startsWith("volcano")){
          this.volcanos.add(new Volcano(this, object.x - 16, object.y - 16, +object.type || 3000))
        }

        if (object.name.startsWith("water_volcano")){
          this.waterVolcanos.add(new WaterVolcano(this, object.x - 16, object.y - 16, +object.type || 3000))
        }

        if (object.name.startsWith("exit")){
          this.exits.add(new Exit(this, object.x - 16, object.y))
        }

        if (object.name.startsWith("checkpoint")){
          this.checkpoints.add(new Checkpoint(this, object.x, object.y))
        }

        if (object.name === "gold") {
          let gold = new Gold(this, object.x, object.y);
          this.golds.add(gold)
        }

        if (object.name === "fish") {
          let fish = new Fish(this, object.x, object.y, object.type);
          this.fish.add(fish)
        }

        if (object.name === "mine") {
          let mine = new Mine(this, object.x, object.y);
          this.mines.add(mine)
        }


        if (object.name === "text") {
          this.texts.push(object);
        }
      })
    }

    showTexts() {
      this.texts.forEach(text => {
       let help = this.add.bitmapText(text.x, text.y, "pixelFont", text.type, 30).setOrigin(0.5).setTint(0x0eb7b7).setDropShadow(1, 2, 0xffffff, 0.7);
       this.tweens.add({
         targets: help,
         duration: 10000,
         alpha: { from: 1, to: 0.9},
         yoyo: true,
         repeat: -1
       })
     })
   }

    addPlayer () {
      const playerPosition = this.registry.get("checkpoint") ||  this.objectsLayer.objects.find( object => object.name === "player")
      this.player = new Player(this, playerPosition.x, playerPosition.y)
      this.addHealth();
      this.physics.add.collider(this.player, this.platform, this.hitPlatform, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.volcanos, this.hitVolcanos, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.bubbles, this.hitBubbles, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.volcanoShots, this.hitVolcanoShots, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.fish, this.platform, this.fishHitPlatform, ()=>{
        return true;
      }, this);


      this.physics.add.collider(this.golds, this.platform, this.goldHitPlatform, ()=>{
        return true;
      }, this);
  
      this.physics.add.collider(this.player, this.mines, this.hitMines, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.fish, this.hitFish, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.exits, this.exitScene, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.golds, this.pickGold, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.checkpoints, this.hitCheckpoint, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.fireballs, this.mines, this.hitFoe, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.fireballs, this.volcanoShots, this.hitFoe, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.fireballs, this.fish, this.hitFishFoe, ()=>{
        return true;
      }, this);

      this.cameras.main.startFollow(this.player);
    }

    hitBubbles (player, bubble) {

    }

    goldHitPlatform (gold, platform) {

    }
    fishHitPlatform (fish, platform) {
      this.bubbleExplosion(fish)
      fish.turn();
    }

    hitVolcanos (player, volcano) {
      if (!this.player.isHit) {
        new Explosion(this, this.player.x, this.player.y, 0.5)
        this.player.hit();
      }

    }

    hitFoe(fireball, foe) {
      new Explosion(this, foe.x, foe.y, 1)
      new Explosion(this, fireball.x, fireball.y, 1, "blue_explosion")
      fireball.destroy();
      foe.destroy();
    }

    hitFishFoe(fireball, fish) {
      new Explosion(this, fireball.x, fireball.y, 1, "blue_explosion")
      fireball.destroy();
      fish.destroy();
    }

    hitVolcanoShots (player, volcanoShot) {
      if (!this.player.isHit) {
        new Explosion(this, this.player.x, this.player.y, 1)
        this.player.hit();
        volcanoShot.destroy();
      }
    }

    hitMines (player, mine) {
      if (!this.player.isHit) {
        new Explosion(this, this.player.x, this.player.y, 3)
        this.player.hit();
        mine.destroy();
      }
    }

    hitFish (player, fish) {
      if (!this.player.isHit) {
        this.playAudio("bump", 1);
        this.player.hit();
        fish.turn();
      }
    }

    hitPlatform(player, platform) {
      if (!this.player.isHit && !this.player.body.blocked.down) {
        this.playAudio("bump", 0.6);
      }
    }

    pickGold (player, gold) {

      if (!gold.pickable) return
      gold.pick();
      gold.destroy();
      player.showPoints("+1")
      this.updateGolds();
     // this.player.pickEmber();
      this.bubbleExplosion(player)
      this.playAudio("pick")

    }

    hitCheckpoint(player, checkpoint) {
      const position = {x: checkpoint.x, y: player.y };
      this.bubbleExplosion(player)
      checkpoint.destroy();
      player.showPoints("CHECKPOINT!")
      this.registry.set("checkpoint", position)
    }

    exitScene(player, platform) {

      this.finishScene()
    }

    loadAudios () {
      this.audios = {
        "pick": this.sound.add("pick"),
        "ember": this.sound.add("ember"),
        "win": this.sound.add("win"),
        "bump": this.sound.add("bump"),
        "death": this.sound.add("death"),
        "explosion": this.sound.add("explosion"),
        "fireball": this.sound.add("fireball"),
        "volcano": this.sound.add("volcano"),
        "water_volcano": this.sound.add("water_volcano"),
        "bubble0": this.sound.add("bubble0"),
        "bubble1": this.sound.add("bubble1"),
        "bubble2": this.sound.add("bubble2"),
        "bubble3": this.sound.add("bubble3"),
        "bubble4": this.sound.add("bubble4"),
        "bubble5": this.sound.add("bubble5"),
        "bubble6": this.sound.add("bubble6"),
      };
    }

    playBubble() {
      const bubble = Phaser.Math.Between(0, 6);
      this.audios[`bubble${bubble}`].play({volume: 0.6});
    }

    playAudio(key, volume=1) {
      this.audios[key].play({volume});
    }

    playRandom(key) {
      this.audios[key].play({
        rate: Phaser.Math.Between(1, 1.5),
        detune: Phaser.Math.Between(-1000, 1000),
        volume: Phaser.Math.Between(10.0, 5.0)/10.0,
        delay: 0
      });
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

    bubbleExplosion(x, y, min = 10, color = 0xffffff) {
      Array(Phaser.Math.Between(min, min * 2)).fill(0).forEach(i => {
        this.trailLayer.add(new Bubble(this, x + (Phaser.Math.Between(-32, 32)) , y + (Phaser.Math.Between(-32, 32)),  50, 1, 600, color))
      })
    } 

    update() {

    }

    hurryUp () {
      const x = this.cameras.main.worldView.centerX;
      const y = this.cameras.main.worldView.centerY;
      const hurryText = this.add.bitmapText(x, y, "pixelFont", "Hurry UP", 40).setOrigin(0.5).setTint(0x0eb7b7).setDropShadow(1, 2, 0xffffff, 0.7);
      this.tweens.add({
        targets: hurryText,
        duration: 100,
        alpha: {from: 0, to: 1},
        repeat: 10,
        yoyo: true,
        onComplete: () => {
          hurryText.destroy();
        }
        
    });
    }

    gameOver () {
      const x = this.cameras.main.worldView.centerX;
      const y = this.cameras.main.worldView.centerY;
      this.add.bitmapText(x, y, "pixelFont", "YOU DIED!", 60).setOrigin(0.5).setTint(0x0eb7b7).setDropShadow(1, 2, 0xffffff, 0.7);
      this.playAudio("death")
      //this.sky.stop();
      //this.theme.stop();
      this.time.delayedCall(2000, () => { 
        this.game.sound.stopAll();
        this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number});
      }, null, this)
    }
    skip () {
      if (this.number === 0) {
        this.finishScene();
      }
    }

    timerFinished () {
      if (!this.sceneIsOver) {
        this.playAudio("explosion")
        this.player.hit()
        new Explosion(this, this.player.x, this.player.y, 0.5)
        this.gameOver()
      }
    }

    sceneOver() {

      this.player.dead = true;
      this.player.body.stop();
      this.player.body.enabled = false;
      this.sceneIsOver = true;

      this.playAudio("win");
      const x = this.cameras.main.worldView.centerX;
      const y = this.cameras.main.worldView.centerY;
      this.add.bitmapText(x, y, "pixelFont", "STAGE CLEAR!!", 60).setOrigin(0.5).setTint(0x0eb7b7).setDropShadow(1, 2, 0xffffff, 0.7);
      this.time.delayedCall(2000, () => { this.finishScene()}, null, this)
    }

    finishScene () {
      const gold = +this.registry.get("golds");
      const totalGolds = +this.registry.get("totalGolds");
      this.registry.set("totalGolds", gold + totalGolds)
      if (this.number === 3) {
        this.game.sound.stopAll();
        this.scene.start("outro", {next: "underwater", name: "STAGE", number: this.number + 1});
      } else {
        this.registry.set("checkpoint", null)
        this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1});
      }
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }

    updateHealth (health) {
      health = health < 0 ? 0 : health;
      this.healthBar.width = health * 5.8;
      this.playerLight.radius = health * 5;
    }

    updateGolds (count = 1) {
      const golds = +this.registry.get("golds") + count;
      this.registry.set("golds", golds);
      this.scoreEmber.setText("x"+golds);
      this.tweens.add({
        targets: [this.scoreEmber, this.scoreEmberLogo],
        scale: { from: 1.4, to: 1},
        duration: 50,
        repeat: 10
      })
    }
}
