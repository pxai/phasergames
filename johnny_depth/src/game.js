import Player from "./player";
import Exit from "./exit";
import Checkpoint from "./checkpoint";
import Volcano from "./volcano";
import WaterVolcano from "./water_volcano";
import Ember from "./ember";
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
      console.log("Added scene number: ", this.number)
      this.addMap();
      this.showTexts();
      this.addPlayer();
      this.addLight();
      this.addScore();

      this.loadAudios(); 
    }

    addScore() {
      this.scoreEmber = this.add.bitmapText(75, 20, "pixelFont", "x0", 15).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0).setScrollFactor(0)
      this.scoreEmberLogo = this.add.sprite(50, 25, "ember").setOrigin(0.5).setScrollFactor(0)
      const emberAnimation = this.anims.create({
        key: "emberscore",
        frames: this.anims.generateFrameNumbers("ember", ),
        frameRate: 8,
      });
      this.scoreEmberLogo.play({ key: "emberscore", repeat: -1 });
    }

    addHealth () {
      this.emptyHealth = null;
      this.healthBar = new HealthBar(this, 0, 0).setOrigin(0.5)
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
      this.embers = this.add.group();
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

        if (object.name === "ember") {
          let ember = new Ember(this, object.x, object.y);
          this.embers.add(ember)
        }

        if (object.name === "ember_head") {
          let emberHead = new Ember(this, object.x, object.y, "ember_head");
          this.emberHeads.add(emberHead)
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
       let help = this.add.bitmapText(text.x, text.y, "pixelFont", text.type, 30).setOrigin(0).setTint(0x0777b7).setDropShadow(1, 2, 0xffffff, 0.7);
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

      this.physics.add.collider(this.player, this.mines, this.hitMines, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.fish, this.hitFish, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.exits, this.exitScene, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.embers, this.hitEmber, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.emberHeads, this.hitEmber, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.healthBar, this.embers, this.pickEmber, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.healthBar, this.emberHeads, this.pickEmberHead, ()=>{
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
      if (!this.player.isHit)
        this.playAudio("bump", 0.6);
        this.player.hit();
    }

    hitEmber (player, ember) {
      if (ember.taken) return;
      ember.taken = true;
      this.bubbleExplosion(player)
      this.playAudio("pick")
      ember.body.setImmovable(false);
      ember.body.setAllowGravity(true)
      ember.tween.stop();
    }

    hitCheckpoint(player, checkpoint) {
      const position = {x: checkpoint.x, y: player.y };
      this.bubbleExplosion(player)
      checkpoint.destroy();
      player.showPoints("CHECKPOINT!")
      this.registry.set("checkpoint", position)
    }

    pickEmber (healthBar, ember) {
      ember.pick();
      this.updateEmbers();
      this.player.pickEmber();
      this.playAudio("ember")
      this.tweens.add({
        targets: [this.healthBar],
        scale: { from: 1.2, to: 1},
        duration: 50,
        repeat: 5
      })
    }

    pickEmberHead (healthBar, emberHead) {
      emberHead.pick();
      this.updateEmbers();
      this.player.pickEmber();
      this.playAudio("win")
      this.tweens.add({
        targets: [this.healthBar],
        scale: { from: 1.2, to: 1},
        duration: 50,
        repeat: 5,
        onComplete: () => {
          this.finishScene()
        }
      })
    }

    exitScene(player, platform) {
      console.log("hit exit")
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

    gameOver () {
      this.playAudio("death")
      //this.sky.stop();
      //this.theme.stop();
        this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number});
 
    }
    skip () {
      if (this.number === 0) {
        this.finishScene();
      }
    }

    finishScene () {
      if (this.number === 1) {
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

    updateEmbers () {
      const embers = +this.registry.get("embers") + 1;
      this.registry.set("embers", embers);
      this.scoreEmber.setText("x"+embers);
      this.tweens.add({
        targets: [this.scoreEmber, this.scoreEmberLogo],
        scale: { from: 1.4, to: 1},
        duration: 50,
        repeat: 10
      })
    }
}
