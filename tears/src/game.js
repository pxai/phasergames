import Player from "./player";
import { Debris } from "./particle";
import Drone from "./drone";
import Quanthuman from "./quanthuman";
import Turn from "./turn";
import LunchBox from "./lunchbox";
import Platform from "./platform";
import Weather from "./weather";
import Lightning from "./lightning";

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
      this.cameras.main.setBackgroundColor(0x052c46)
      this.landscape = this.add.tileSprite(0, 800, 2048, 1543, "background").setOrigin(0.5).setScrollFactor(0, 1);
      this.createMap();

      this.cameras.main.setBounds(0, 0, 20920 * 2, 20080 * 2);
      this.physics.world.setBounds(0, 0, 20920 * 2, 20080 * 2);
      this.addPlayer();

      this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 100);
      this.cameraY = 0;

      this.physics.world.enable([ this.player ]);
      this.addScore();
      this.loadAudios(); 
      this.playMusic();
      new Weather(this, "rain");
      this.setLightning();
    }

    setLightning () {
      this.lightsOut = this.add.rectangle(0, 0, this.width + 200, this.height + 500, 0x0).setOrigin(0).setScrollFactor(0)
      this.lightsOut.setAlpha(0);
      this.lightningEffect = this.add.rectangle(0, 0, this.width + 200, this.height + 500, 0xffffff).setOrigin(0).setScrollFactor(0)
      this.lightningEffect.setAlpha(0);
      this.lightning = new Lightning(this);
    }

    addScore() {
      this.scoreGun = this.add.bitmapText(75, 10, "type", "x6 ", 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0).setScrollFactor(0)
      this.scoreGunLogo = this.add.sprite(50, 25, "gun").setScale(1).setOrigin(0.5).setScrollFactor(0)
      this.scoreText = this.add.bitmapText(this.center_width + 17, 10, "type", "x0 ", 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0).setScrollFactor(0)
      this.scoreLogo = this.add.sprite(this.center_width, 28, "score").setScale(0.9).setOrigin(0.5).setScrollFactor(0)
    }

    createMap() {
      this.tileMap = this.make.tilemap({ key: "scene" + this.number , tileWidth: 64, tileHeight: 64 });
      this.tileSetBg = this.tileMap.addTilesetImage("background");
      this.tileMap.createStaticLayer('background', this.tileSetBg)
  
      this.tileSet = this.tileMap.addTilesetImage("softbricks");
      this.platform = this.tileMap.createLayer('scene' + this.number, this.tileSet);
      this.objectsLayer = this.tileMap.getObjectLayer('objects');

      this.platform.setCollisionByExclusion([-1]);

      this.droneGroup = this.add.group();
      this.quanthumanGroup = this.add.group();
      this.foesGroup = this.add.group();
      this.turnGroup = this.add.group();
      this.exitGroup = this.add.group();
      this.platformGroup = this.add.group();
      this.lunchBoxGroup = this.add.group();
      this.letters = this.add.group();
      this.fireballs = this.add.group();

      this.objectsLayer.objects.forEach( object => {
        if (object.name === "drone") {
          
          let drone = new Drone(this, object.x, object.y, object.type);
          this.droneGroup.add(drone)
          this.foesGroup.add(drone)
        }
 
        if (object.name === "quanthuman") {
          let quanthuman = new Quanthuman(this, object.x, object.y, object.type);
          this.quanthumanGroup.add(quanthuman);
          this.foesGroup.add(quanthuman);
        }

        if (object.name.startsWith("platform")) {
          const [name, size, type] = object.name.split(":");
          this.platformGroup .add(new Platform(this, object.x, object.y, size, type))
        }

        if (object.name === "turn") {
          this.turnGroup.add(new Turn(this, object.x, object.y))
        }

        if (object.name === "lunchbox") {
          this.lunchBoxGroup.add(new LunchBox(this, object.x, object.y))
        }

        if (object.name === "text") {
          this.add.bitmapText(object.x, object.y, "type", object.text.text, 30).setDropShadow(2, 4, 0x222222, 0.9).setOrigin(0)
        }

        if (object.name === "exit") {
          this.exitGroup.add(new Turn(this, object.x, object.y, object.width, object.height, object.type).setOrigin(0.5))
        }
      });

      this.physics.add.collider(this.droneGroup, this.platform, this.turnFoe, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.droneGroup, this.turnGroup, this.turnFoe, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.quanthumanGroup, this.platform, this.hitFloor, ()=>{
        return true;
      }, this);
    }

    turnFoe (foe, platform) {
      foe.turn();
    }


    hitFloor() {

    }

    addPlayer() {
      this.trailLayer = this.add.layer();
      this.elements = this.add.group();
      this.gun = this.add.group();

      const playerPosition = this.objectsLayer.objects.find( object => object.name === "player")
      this.player = new Player(this, playerPosition.x, playerPosition.y, 0);

      this.physics.add.collider(this.player, this.platform, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.platformGroup, this.hitPlatform, ()=>{
        return true;
      }, this);
  
      this.physics.add.collider(this.player, this.letters, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.fireballs, this.hitPlayer, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.lunchBoxGroup, this.pickLunchBox, ()=>{
        return true;
      }, this);
  
      this.physics.add.overlap(this.player, this.exitGroup, () => { 
        this.playAudio("stage");
        this.time.delayedCall(1000, () => this.finishScene(), null, this);
      }, ()=>{
        return true;
      }, this);

      this.blows = this.add.group();

      this.physics.add.overlap(this.blows, this.letters, this.blowBrick, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.letters, this.foesGroup, this.blowFoe, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.letters, this.fireballs, this.blowFireball, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.droneGroup, this.hitPlayer, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.quanthumanGroup, this.hitPlayer, ()=>{
        return true;
      }, this);

    }

    blowFireball (letter, fireball) {
      fireball.destroy();
    }

    pickCoin (player, coin) {
      if (!coin.disabled) {
        coin.pick();
        this.playAudio("coin");
        this.updateGun();
      }
    }

    pickLunchBox (player, lunchBox) {
      if (!lunchBox.disabled) {
        this.playAudio("lunchbox");
        lunchBox.pick();
      }
    }

    hitPlayer(player, foe) {
      if (player.invincible) {
        foe.death();
        this.playAudio("foedeath");
      } else if (!player.dead) {
        if (foe.name === "fireball") {
          foe.destroy();
        }
        player.die();
        this.playAudio("death");
      }
    }

    blowFoe(letter, foe) {
      this.playAudio("kill");
      this.playAudio("foedeath");
      if (foe.name === "quanthuman"){
        this.updateScore(1);
      }
      foe.death();
    }

    foeBlowBrick(brick, foe) {
      foe.turn();
      Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this, brick.x, brick.y))
      brick.destroy();
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
        this.spawnCoin(tile)

      } 
    }

    spawnCoin(tile) {
      if (Phaser.Math.Between(0, 11) > 5) {
        this.time.delayedCall(500, () => { this.gun.add(new Coin(this, tile.pixelX, tile.pixelY))}, null, this);
      }
    }

    blowBrick (blow, brick) {
      if (this.player.mjolnir) this.cameras.main.shake(30);
      this.playAudio("stone_fail");
      this.playAudioRandomly("stone");
      blow.destroy();
      Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this, brick.x, brick.y))
      brick.destroy();
    }

    getTile(platform) {
      const {x, y} = platform;
      return this.platform.getTileAt(x, y);
    }

    isBreakable (tile) {
      return tile?.properties['element'] === "break"
    }

    hitFloor(player, platform) {
      if (this.player.jumping && !this.player.falling && this.player.body.velocity.y === 0) {
        const tile = this.getTile(platform)
        if (this.isBreakable(tile)) {
          this.playAudioRandomly("stone");
          Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this, tile.pixelX, tile.pixelY))
          this.platform.removeTileAt(tile.x, tile.y);
        } else if (platform?.name === "brick0") {
          this.playAudioRandomly("stone");
          Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this, platform.x, platform.y))
          platform.destroy();
        }
      }
    }

    hitPlatform(player, platform) {
      this.player.isOnPlatform = true;
    }

      loadAudios () {
        this.audios = {
          "build": this.sound.add("build"),
          "coin": this.sound.add("coin"),
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
          "thunder0": this.sound.add("thunder0"),
          "thunder1": this.sound.add("thunder1"),
          "thunder2": this.sound.add("thunder2"),
          "thunder3": this.sound.add("thunder3"),
          "foeshot": this.sound.add("foeshot"),
          "type": this.sound.add("type"),
          "bell": this.sound.add("bell"),
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

      playMusic (theme="game") {
        this.theme = this.sound.add("music0") // + this.number);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 0.5,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
      }

    update() {
      this.landscape.setTilePosition(this.cameras.main.scrollX);
      this.player.update();
      if (this.number !== 3 && this.player.y > 1500) this.restartScene();
    }

    finishScene () {
      if (this.theme) this.theme.stop();
      this.scene.start("transition", { name: "STAGE", number: this.number + 1});
    }

    restartScene () {
      this.time.delayedCall(500, () => {
          if (this.theme) this.theme.stop();
          this.scene.start("game", { name: "STAGE", number: this.number});
        },
        null,
        this
      );
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText("x" +score);
    }

    updateGun (gun) {
      this.registry.set("gun", );
      this.scoreGun.setText("x"+gun);
      this.tweens.add({
        targets: [this.scoreGun, this.scoreGunLogo],
        scale: { from: 1.4, to: 1},
        duration: 50,
        repeat: 10
      })
    }
}
