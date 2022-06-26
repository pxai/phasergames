import Player from "./player";
import Exit from "./exit";
import Volcano from "./volcano";
import WaterVolcano from "./water_volcano";
import Ember from "./ember";
import Mine from "./mine";
import Fish from "./fish";
import HealthBar from "./health_bar";

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
      this.addPlayer();
      this.addLight();
      this.addScore();

      //this.loadAudios(); 
      // this.playMusic();
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
      this.volcanos = this.add.group();
      this.waterVolcanos = this.add.group();
      this.volcanoShots = this.add.group();
      this.brokenBlocks = this.add.group();
      this.mines = this.add.group();
      this.fish = this.add.group();
      this.texts = [];
      this.objectsLayer.objects.forEach( object => {
        if (object.name.startsWith("volcano")){
          this.volcanos.add(new Volcano(this, object.x - 16, object.y - 16))
        }

        if (object.name.startsWith("water_volcano")){
          this.waterVolcanos.add(new WaterVolcano(this, object.x - 16, object.y - 16))
        }

        if (object.name.startsWith("exit")){
          this.exits.add(new Exit(this, object.x - 16, object.y))
        }

        if (object.name === "ember") {
          let ember = new Ember(this, object.x, object.y);
          this.embers.add(ember)
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

    addPlayer () {
      const playerPosition = this.objectsLayer.objects.find( object => object.name === "player")
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

      this.physics.add.collider(this.player, this.volcanoShots, this.hitVolcanoShots, ()=>{
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

      this.physics.add.overlap(this.healthBar, this.embers, this.pickEmber, ()=>{
        return true;
      }, this);

      this.cameras.main.startFollow(this.player);
    }

    hitBubbles (player, bubble) {

    }

    fishHitPlatform (fish, platform) {
      fish.turn();
    }

    hitVolcanos (player, volcano) {
      if (!this.player.isHit)
      this.player.hit();
    }

    hitVolcanoShots (player, volcanoShot) {
      if (!this.player.isHit) {
        this.player.hit();
        volcanoShot.destroy();
      }
    }

    hitMines (player, mine) {
      if (!this.player.isHit) {
        this.player.hit();
        mine.destroy();
      }
    }

    hitFish (player, fish) {
      if (!this.player.isHit) {
        this.player.hit();
        fish.turn();
      }
    }

    hitPlatform(player, platform) {
      if (!this.player.isHit)
        this.player.hit();
    }

    hitEmber (player, ember) {
      ember.body.setImmovable(false);
      ember.body.setAllowGravity(true)
      ember.tween.stop();
    }

    pickEmber (healthBar, ember) {
      ember.pick();
      this.updateEmbers();
      this.player.pickEmber();
      this.tweens.add({
        targets: [this.healthBar],
        scale: { from: 1.2, to: 1},
        duration: 50,
        repeat: 5
      })
    }

    exitScene(player, platform) {
      console.log("hit exit")
      this.finishScene()
    }

    loadAudios () {
      this.audios = {
        "beam": this.sound.add("beam"),
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

    finishScene () {
      //this.sky.stop();
      //this.theme.stop();
      this.scene.start("outro", {next: "underwater", name: "STAGE", number: this.number + 1});
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }

    updateHealth (health) {
      console.log("Added health: ", health)
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
