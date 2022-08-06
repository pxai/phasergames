import Player from "./player";
import { Debris } from "./particle";
import Bat from "./bat";
import Zombie from "./zombie";
import Turn from "./turn";
import Coin from "./coin";
import LunchBox from "./lunchbox";
import Platform from "./platform";
import texts  from "./texts";
import Text from "./text";

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
      this.cameras.main.setBackgroundColor(0x62a2bf)
      this.add.tileSprite(0, 1000, 1024 * 10, 512, "landscape").setOrigin(0.5);
      this.texts = {};
      this.showingLogo = false;
      this.createMap();

      this.cameras.main.setBounds(0, 0, 20920 * 2, 20080 * 2);
      this.physics.world.setBounds(0, 0, 20920 * 2, 20080 * 2);

      this.addPlayer();

      this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 100);
      this.physics.world.enable([ this.player ]);
      this.addScore();
      this.loadAudios(); 
      this.playMusic();
    }

    addScore() {
      this.scoreCoins = this.add.bitmapText(75, 20, "pixelFont", "x0", 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0).setScrollFactor(0)
      this.scoreCoinsLogo = this.add.sprite(50, 35, "coin").setScale(1).setOrigin(0.5).setScrollFactor(0)
      const coinAnimation = this.anims.create({
        key: "coinscore",
        frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 7 }, ),
        frameRate: 8,
      });
      this.scoreCoinsLogo.play({ key: "coinscore", repeat: -1 });
    }

    createMap() {
      this.tileMap = this.make.tilemap({ key: "scene" + this.number , tileWidth: 64, tileHeight: 64 });
      this.tileSetBg = this.tileMap.addTilesetImage("background");
      this.tileMap.createStaticLayer('background', this.tileSetBg)
  
      this.tileSet = this.tileMap.addTilesetImage("softbricks");
      this.platform = this.tileMap.createLayer('scene' + this.number, this.tileSet);
      this.objectsLayer = this.tileMap.getObjectLayer('objects');

      this.platform.setCollisionByExclusion([-1]);

      this.batGroup = this.add.group();
      this.zombieGroup = this.add.group();
      this.foesGroup = this.add.group();
      this.turnGroup = this.add.group();
      this.exitGroup = this.add.group();
      this.platformGroup = this.add.group();
      this.lunchBoxGroup = this.add.group();
      this.bricks = this.add.group();
      this.activateGroup = this.add.group();

      this.objectsLayer.objects.forEach( object => {
        if (object.name === "bat") {
          let bat = new Bat(this, object.x, object.y, object.type);
          this.batGroup.add(bat)
          this.foesGroup.add(bat)
        }

        if (object.name === "zombie") {
          let zombie = new Zombie(this, object.x, object.y, object.type);
          this.zombieGroup.add(zombie);
          this.foesGroup.add(zombie);
        }

        if (object.name === "platform") {
          const [platform_size, platform_type] = object.type.split(":")
          console.log("Dale platform", platform_size, platform_type )
          //new Platform(this, 700, 700, 2, false, 1)
          this.platformGroup.add(new Platform(this, object.x, object.y, +platform_size, false, +platform_type))
        }

        if (object.name === "turn") {
          this.turnGroup.add(new Turn(this, object.x, object.y))
        }

        if (object.name === "lunchbox") {
          this.lunchBoxGroup.add(new LunchBox(this, object.x, object.y))
        }

        if (object.name.startsWith("text")) {
          this.addText(object);
        }

        if (object.name === "activator") {
          this.activateGroup.add(new Text(this, object.x, object.y, object.type))
        }

        if (object.name === "exit") {
          this.exitGroup.add(new Turn(this, object.x, object.y, object.width, object.height, object.type).setOrigin(0.5))
        }
      });

      this.physics.add.collider(this.batGroup, this.platform, this.turnFoe, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.zombieGroup, this.bricks, this.turnFoe, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.batGroup, this.bricks, this.turnFoe, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.zombieGroup, this.turnGroup, this.turnFoe, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.zombieGroup, this.platform, this.hitFloor, ()=>{
        return true;
      }, this);

    }

    addText (object) {
      this.texts[object.name] = this.add.group();
      this.texts[object.name].add(this.add.bitmapText(object.x, object.y, "pixelFont", texts[object.name].title, texts[object.name].size).setAlpha(0))
      texts[object.name].items.forEach( (item, i) => {
        this.texts[object.name].add(this.add.bitmapText(object.x + 20, object.y + ((i+1) * 60), "pixelFont", item.text, 30).setAlpha(0)); 
      })
    }

    activate(player, activation) {
      console.log("Touched ", activation.name, this.texts[activation.name]);
      if (this.currentText) {
        this.tweens.add({
          targets: this.texts[this.currentText].children.entries,
          duration: 1000,
          alpha: { from: 1, to: 0},
        })
      }
      this.tweens.add({
        targets: this.texts[activation.name].children.entries,
        duration: 2000,
        alpha: { from: 0, to: 1},
      })
      activation.destroy();
      this.currentText = activation.name;
    }

    turnFoe (foe, platform) {
      foe.turn();
    }


    hitFloor() {

    }

    addPlayer() {
      this.elements = this.add.group();
      this.coins = this.add.group();

      const playerPosition = this.objectsLayer.objects.find( object => object.name === "player")
      this.player = new Player(this, playerPosition.x, playerPosition.y, 0);

      this.physics.add.collider(this.player, this.platform, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.platformGroup, this.hitFloor, ()=>{
        return true;
      }, this);
  
      this.physics.add.collider(this.player, this.bricks, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.coins, this.pickCoin, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.lunchBoxGroup, this.pickLunchBox, ()=>{
        return true;
      }, this);
  
      this.physics.add.overlap(this.player, this.exitGroup, () => { 
        this.playAudio("stage");
        this.time.delayedCall(1000, () => this.showLogo(), null, this);
      }, ()=>{
        return true;
      }, this);

      this.blows = this.add.group();

      this.physics.add.overlap(this.blows, this.platform, this.blowPlatform, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.blows, this.bricks, this.blowBrick, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.blows, this.foesGroup, this.blowFoe, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.bricks, this.foesGroup, this.foeBlowBrick, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.batGroup, this.hitPlayer, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.zombieGroup, this.hitPlayer, ()=>{
        return true;
      }, this);


      this.physics.add.overlap(this.player, this.activateGroup, this.activate, () => {
        return true;
      }, this);

    }

    pickCoin (player, coin) {
      if (!coin.disabled) {
        coin.pick();
        this.playAudio("coin");
        this.updateCoins();
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
      } else if (!player.dead && this.number > 0) {
        player.die();
        this.playAudio("death");
      }
    }

    blowFoe(blow, foe) {
      this.playAudio("kill");
      this.playAudio("foedeath");
      foe.death();
    }

    foeBlowBrick(brick, foe) {
      foe.turn();
      Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this, brick.x, brick.y))
      brick.destroy();
    }

    blowPlatform (blow, platform) {
      const tile = this.getTile(platform)
      console.log("Hit platform: ", tile)
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
        this.time.delayedCall(500, () => { this.coins.add(new Coin(this, tile.pixelX, tile.pixelY))}, null, this);
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
          "step": this.sound.add("step"),
        };
      }

      playAudio(key) {
        this.audios[key].play();
      }

      playRandom(key, volume = 1) {
        this.audios[key].play({
          rate: Phaser.Math.Between(1, 1.5),
          detune: Phaser.Math.Between(-1000, 1000),
          delay: 0,
          volume
        });
      }

      playAudioRandomly(key) {
        const volume = Phaser.Math.Between(0.8, 1);
        const rate = Phaser.Math.Between(0.8, 1);
        this.audios[key].play({volume, rate});
      }

      playMusic (theme="game") {
        this.theme = this.sound.add("music" + this.number);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 0.7,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
      }

    update() {
      this.player.update();
      if (this.number === 3 && this.player.y > 1500) this.restartScene();
    }

    showLogo () {
      if (!this.showingLogo) {
        const logoPosition = this.objectsLayer.objects.find( object => object.name === "logo")
        this.showingLogo = true;
        this.cameras.main.stopFollow();
        this.cameras.main.pan(logoPosition.x - 200, logoPosition.y, 2000, 'Sine.easeInOut')
        this.showTitle(logoPosition.x, logoPosition.y);
      }
    }

    showTitle (x, y) {
      //let text = this.add.bitmapText(x, y, "pixelFont", "", 50).setTint(0xfba933).setOrigin(0.5).setDropShadow(2, 3, 0xf09937, 0.9)
      "BOOTCAMP".split("").forEach((letter, i) => {
        console.log("Dale: ", letter, x +  (i * 20))
          this.time.delayedCall(200 * (i+1),
              () => {
                  this.playAudioRandomly("stone_fail")

                  if (Phaser.Math.Between(0, 5) > 2) this.playAudioRandomly("stone")

                  let text = this.add.bitmapText(x +  (i * 100) , y, "pixelFont", letter, 110).setTint(0xfba933).setOrigin(0.5).setDropShadow(2, 3, 0xf09937, 0.9)
                  Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this, text.x , text.y, 0xca6702))
              },
              null,
              this
          );
      })

      const flags = ["js", "html", "python", "css"]
        flags.forEach((flag, i) => {
            this.time.delayedCall(500 * (i+1) + 800,
                () => {
                    this.playAudioRandomly("stone_fail")
                    if (Phaser.Math.Between(0, 5) > 2) this.playAudioRandomly("stone")
                    let image = this.add.image((x + 100) + (i * 180), y + 130, flag).setOrigin(0.5)
                    Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this, image.x , image.y, 0xca6702))
                },
                null,
                this
            );
        })

    }

    finishScene () {
      if (this.theme) this.theme.stop();
      this.scene.start("transition", { name: "STAGE", number: this.number + 1});
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
        scale: { from: 1.4, to: 1},
        duration: 50,
        repeat: 10
      })
    }
}
