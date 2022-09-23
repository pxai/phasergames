import Block from "./block";
import FiringBlock from "./firing_block";
import Player from "./player";
import Bat from "./bat";
import Coin from "./coin";
import Exit from "./exit";
import WaterPlatform from "./water_platform";
import { RockSmoke, Smoke, Sand } from "./particle";

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
      this.cameras.main.setBackgroundColor(0x212121)
      this.addMap();
      this.addPlayer();
      this.addScore();
      this.addWater();
      this.loadAudios(); 
      this.showTexts();
      // this.playMusic();
    }

    addScore() {
      this.scoreCoins = this.add.bitmapText(75, 20, "pixelFont", "x0", 30).setDropShadow(0, 4, 0x222222, 0.9).setScale(0.5).setOrigin(0).setScrollFactor(0)
      this.scoreCoinsLogo = this.add.sprite(50, 25, "coin").setScale(0.5).setOrigin(0.5).setScrollFactor(0)
      const coinAnimation = this.anims.create({
        key: "coinscore",
        frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 7 }, ),
        frameRate: 8,
      });
      this.scoreCoinsLogo.play({ key: "coinscore", repeat: -1 });
    }

    addMap() {
      this.tileMap = this.make.tilemap({ key: `scene${this.number}` , tileWidth: 32, tileHeight: 32 });
      this.tileSetBg = this.tileMap.addTilesetImage("tileset_fg");
      this.tileMap.createStaticLayer('background', this.tileSetBg)
  
      this.tileSet = this.tileMap.addTilesetImage("tileset_fg");
      this.platform = this.tileMap.createLayer(`scene${this.number}`, this.tileSet);
      this.breakable = this.tileMap.createLayer("breakable", this.tileSet);
      this.objectsLayer = this.tileMap.getObjectLayer('objects');
      this.platform.setCollisionByExclusion([-1]);
      this.breakable.setCollisionByExclusion([-1]);
      this.physics.world.setBounds(0, 0, this.width, this.height);
      this.exits = this.add.group();
      this.blocks = this.add.group();
      this.hearts = this.add.group();
      this.batGroup = this.add.group();
      this.foesGroup = this.add.group();
      this.fireballs = this.add.group();
      this.coins = this.add.group();
      this.bubbles = this.add.group();
      this.brokenBlocks = this.add.group();
      this.texts = [];
      this.objectsLayer.objects.forEach( object => {
        if (object.name.startsWith("block")){
          this.blocks.add(new Block(this, object.x - 16, object.y - 16))
        }

        if (object.name === "bat") {
          let bat = new Bat(this, object.x, object.y, object.type);
          this.batGroup.add(bat)
          this.foesGroup.add(bat)
        }

        if (object.name === "coin") {
          let coin = new Coin(this, object.x, object.y);
          this.coins.add(coin)
        }

        if (object.name === "firing_block") {
          this.brokenBlocks.add(new FiringBlock(this, object.x, object.y));
        }

        if (object.name.startsWith("exit")){
          this.exits.add(new Exit(this, object.x - 16, object.y))
        }

        if (object.name.startsWith("extra_time")){
          this.hearts.add(new ExtraTime(this, object.x, object.y))
        }


        if (object.name === "text") {
          this.texts.push(object);
        }
      })
    }

    showTexts() {
      this.texts.forEach(text => {
       let help = this.add.bitmapText(text.x, text.y, "pixelFont", text.type, 20).setOrigin(0).setTint(0xffe066).setDropShadow(1, 2, 0xbf2522, 0.7);
       this.tweens.add({
         targets: help,
         duration: 10000,
         alpha: { from: 1, to: 0},
         ease: 'Linear'
       })
     })
   }

    addWater () {
      this.bubbleLayer = this.add.layer();
      this.water = this.add.group();
      this.waterPlatform = new WaterPlatform(this)
      this.physics.add.overlap(this.player, this.water, this.hitWater, ()=>{
        return true;
      }, this);
    }

    addPlayer() {
      this.trailLayer = this.add.layer();
      const playerPosition = this.objectsLayer.objects.find( object => object.name === "player")
      this.player = new Player(this, playerPosition.x, playerPosition.y);
      this.physics.add.collider(this.player, this.platform, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.bubbles, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.breakable, this.hitBreakable, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.brokenBlocks, this.hitBroken, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.batGroup, this.hitPlayer, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.exits, this.playerHitsExit, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.batGroup, this.platform, this.turnFoe, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.coins, this.pickCoin, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.fireballs, this.fireballHitPlayer, ()=>{
        return true;
      }, this);


      this.physics.add.collider(this.fireballs, this.platform, this.fireballHitPlatform, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.brokenBlocks, this.platform, this.blockHitPlatform, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.brokenBlocks, this.foesGroup, this.blockHitFoe, ()=>{
        return true;
      }, this);
    }

    onWorldBounds (body, part) {
      const name = body.gameObject.name;

      if (name === "electron") this.playAudio("bump")
      if (["particle"].includes(name))
        body.gameObject.destroy();
    }

    loadAudios () {
      this.audios = {
        "coin": this.sound.add("coin"),
        "exit": this.sound.add("exit"),
        "gold": this.sound.add("gold"),
        "hit": this.sound.add("hit"),
        "jump": this.sound.add("jump"),
        "land": this.sound.add("land"),
        "step": this.sound.add("step"),
        "stone": this.sound.add("stone"),
        "bump1": this.sound.add("bump1"),
        "bump2": this.sound.add("bump2"),
        "boom": this.sound.add("boom"),
        "death": this.sound.add("death"),
        "door": this.sound.add("door"),
        "foeshot": this.sound.add("foeshot"),
        "bubble": this.sound.add("bubble"),
        "crack": this.sound.add("crack"),
      };
    }


    playRandom(key) {
      this.audios[key].play({
        rate: Phaser.Math.Between(1, 1.5),
        detune: Phaser.Math.Between(-1000, 1000),
        delay: 0
      });
    }

    hitPlayer (player, foe) {
      if (foe.name !== "drop") foe.turn();
      this.playerDeath();
    }

    hitFloor(player, block) {
      
    }

    hitBreakable(player, block) {
      if (player.falling) {
        const tile = this.getTile(block)
        this.playRandom("crack")
        const brokenBlock = new Block(this, block.pixelX, block.pixelY)
        Array(Phaser.Math.Between(8, 15)).fill(0).forEach( (sand, i) => {
          new Sand(this, brokenBlock.x + 16, brokenBlock.y + 24, Phaser.Math.Between(-10, 10))
        });
        this.brokenBlocks.add(brokenBlock)
        brokenBlock.fall()
        this.breakable.removeTileAt(tile.x, tile.y);
      }

    }

    hitBroken(player, block) {
      if (block.falling && block.y < player.body.y) {
        this.playerDeath();
      }
    }

    pickCoin (player, coin) {
      if (!coin.disabled) {
        coin.pick();
        this.playAudio("gold");
        this.updateCoins();
      }
    }

    fireballHitPlayer(player, fireball) {
      fireball.destroy();
      this.playerDeath()
    }

    blockHitPlatform(block, platform) {
      block.destroyed = true;
      block.fallSmoke();
      this.playAudio("stone");
      block.destroy();
    }

    blockHitFoe(block, foe) {
      block.destroyed = true;
      foe.destroy();
      this.playAudio("bump1");
      block.fallSmoke();
      block.destroy();
    }

    hitWater(player, water) {
      Array(5).fill(0).forEach(star => {
        new RockSmoke(this, player.x + 16, player.y  + 16)
      })
      //this.playAudio("water");
      this.playerDeath()
    }

    fireballHitPlatform(fireball, platform) {
      this.playAudio("bump2");
      Array(Phaser.Math.Between(1,3)).fill(0).forEach( i => new Smoke(this, fireball.x, fireball.y, null, null, 0x95b8c7))
      fireball.destroy();
    }

    turnFoe (foe, platform) {
      foe.turn();
    }

    playerHitsExit(player, exit) {
      this.playAudio("exit")
      this.finishScene();
    }

    playerDeath () {
      if (this.player.dead) return;
      this.player.hit();
      this.playAudio("death")
      this.cameras.main.shake(100);
      this.time.delayedCall(1000, () => this.restartScene(), null, this);
    }
 
    getTile(platform) {
      const {x, y} = platform;
      return this.breakable.getTileAt(x, y);
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

    restartScene () {
      //this.theme.stop();
      this.scene.start("transition", {name: "STAGE", number: this.number});
    }

    finishScene () {
      //this.theme.stop();
      this.scene.start("transition", { name: "STAGE", number: this.number + 1});
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }

    updateCoins () {
      const coins = +this.registry.get("coins") + 1;
      this.registry.set("coins", coins);
      this.scoreCoins.setText("x"+coins);
      this.tweens.add({
        targets: [this.scoreCoins, this.scoreCoinsLogo],
        scale: { from: 0.7, to: 0.5},
        duration: 50,
        repeat: 10
      })
    }
}
