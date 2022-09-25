import Player from "./player";
import { Debris } from "./particle";
import Bat from "./bat";
import Zombie from "./zombie";
import Exit from "./exit";
import Turn from "./turn";
import Coin from "./coin";
import LunchBox from "./lunchbox";
import Platform from "./platform";
import BrickButton from "./brick_button";
import { JumpSmoke } from "./particle";
import CustomBrick from "./custom_brick";
import SpriteButton from "./sprite_button";


export default class GameBuilder extends Phaser.Scene {
    constructor () {
        super({ key: "game_builder" });
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
      //this.cameras.main.setBackgroundColor(0x62a2bf)
      this.add.tileSprite(0, 200, 1024, 1024, "mapbackground1").setOrigin(0);
      this.createMap();



      this.cameras.main.setBounds(0, 0, 20920 * 2, 20080 * 2);
      this.physics.world.setBounds(0, 0, 20920 * 2, 20080 * 2);
      //this.addPlayer();

     // this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 100);
      //this.physics.world.enable([ this.player ]);
      this.addPointer();
      this.addScore();
      this.loadAudios(); 
      this.addPanel();
      this.addStartButton();
      //this.playMusic();
    }

    addPointer() {
      this.buildTime = 0;
      this.hiddenPointer = false;
      this.pointer = this.input.activePointer;
      this.input.mouse.disableContextMenu();
    }

    addScore() {
      this.scoreCoins = this.add.bitmapText(75, 10, "pixelFont", "x" + this.registry.get("coins"), 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0).setScrollFactor(0)
      this.scoreCoinsLogo = this.add.sprite(50, 25, "coin").setScale(1).setOrigin(0.5).setScrollFactor(0)
      const coinAnimation = this.anims.create({
        key: "coinscore",
        frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 7 }, ),
        frameRate: 8,
      });
      this.scoreCoinsLogo.play({ key: "coinscore", repeat: -1 });
    }

    addPanel () {
      this.selectedBrick = null;
      this.onABuiltBlock = false;
      this.brickTypes = [
        { name: "brick0", cost: 10, description: "Breakable brick"},
        { name: "brick1", cost: 20, description: "Fixed brick"},
        { name: "platform", cost: 50, description: "Moving platform"},
      ];
      this.brickButtons = {};
      this.bricks = [];
      const x = (this.cameras.main.width / 2);
      const y = (this.cameras.main.height - 100);
      this.brickTypes.forEach( (brick, i) => {
        this.brickButtons[brick.name] = new BrickButton(this, x + (i * 64), y, brick).setOrigin(0.5).setScrollFactor(0)
      });
    }

    addStartButton () {
      const x = (this.cameras.main.width / 2);
      const y = (this.cameras.main.height - 100);
      this.startButton = new SpriteButton(this, x + (5* 54), y, "play", "Start Stage", this.startScene.bind(this));

    }

    chooseBrick (brickName) {
      if (this.brickButtons[this.selectedBrick]) {
        this.currentBlockSprite.destroy();
        this.brickButtons[this.selectedBrick].clearTint();
      }
      this.selectedBrick = brickName;
      this.currentBlockSprite = this.add.sprite(50, 25, brickName).setScale(0.5).setOrigin(0).setScrollFactor(0)
    }

    createMap() {
      this.tileMap = this.make.tilemap({ key: "scene" + this.number , tileWidth: 32, tileHeight: 32 });
      this.tileSetBg = this.tileMap.addTilesetImage("background");
      this.tileMap.createStaticLayer('background', this.tileSetBg)
  
      this.tileSet = this.tileMap.addTilesetImage("softbricks");
      this.platform = this.tileMap.createLayer("scene" + this.number, this.tileSet);
      this.objectsLayer = this.tileMap.getObjectLayer('objects');

      console.log(" SCENE: ", 'scene' + this.number, this.tileSet, this.platform, this.objectsLayer )
      this.platform.setCollisionByExclusion([-1]);

      this.batGroup = this.add.group();
      this.zombieGroup = this.add.group();
      this.foesGroup = this.add.group();
      this.turnGroup = this.add.group();
      this.exitGroup = this.add.group();
      this.platformGroup = this.add.group();
      this.lunchBoxGroup = this.add.group();

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
          this.platformGroup.add(new Platform(this, object.x, object.y, object.type))
        }

        if (object.name === "turn") {
          this.turnGroup.add(new Turn(this, object.x, object.y))
        }

        if (object.name === "lunchbox") {
          this.lunchBoxGroup.add(new LunchBox(this, object.x, object.y))
        }

        if (object.name === "text") {
          this.add.bitmapText(object.x, object.y, "pixelFont", object.text.text, 30).setDropShadow(2, 4, 0x222222, 0.9).setOrigin(0)
        }

        if (object.name === "exit") {
          this.exitGroup.add(new Exit(this, object.x, object.y).setOrigin(0.5))
        }
      });

      this.physics.add.collider(this.batGroup, this.platform, this.turnFoe, ()=>{
        return true;
      }, this);


      this.physics.add.collider(this.zombieGroup, this.turnGroup, this.turnFoe, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.zombieGroup, this.platform, this.hitFloor, ()=>{
        return true;
      }, this);
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
      console.log("Player: ", playerPosition.x, playerPosition.y)
      this.player = new Player(this, playerPosition.x, playerPosition.y, 0);

      this.physics.add.collider(this.player, this.platform, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.platformGroup, this.hitFloor, ()=>{
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
        this.time.delayedCall(1000, () => this.finishScene(), null, this);
      }, ()=>{
        return true;
      }, this);

      this.blows = this.add.group();

      this.physics.add.overlap(this.blows, this.platform, this.blowPlatform, ()=>{
        return true;
      }, this);


      this.physics.add.overlap(this.blows, this.foesGroup, this.blowFoe, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.batGroup, this.hitPlayer, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.zombieGroup, this.hitPlayer, ()=>{
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

    update(time, delta) {
      if (this.currentBlockSprite) this.updatePointer();
      this.buildTime += delta;
      if (this.pointer.isDown) {
        const {worldX, worldY}  = this.pointer;
        const point = new Phaser.Geom.Point(worldX, worldY);
        console.log(point.y, this.cameras.main.height - 110)
        if (point.y >= this.cameras.main.height - 110) return;
        if (!this.pointer.rightButtonDown()) {
          this.buildBlock(this.currentBlockSprite);
        }

      }
    }

    updatePointer () {
      const {worldX, worldY}  = this.pointer;
      const point = new Phaser.Geom.Point(worldX, worldY);
      this.currentBlockSprite.x = Math.round(point.x / 32) * 32;
      this.currentBlockSprite.y = Math.round(point.y / 32) * 32;
    }

    buildBlock(sprite) {
      if (this.buildTime < 500 || this.onABuiltBlock) return 0;
      if (this.canBuild(this.selectedBrick)) {
        this.playAudio("build");
        this.buildSmoke(32, sprite.y);
        this.updatePointer();
        this.bricks.push(new CustomBrick(this  , this.currentBlockSprite.x, this.currentBlockSprite.y, this.selectedBrick))
        this.buildTime = 0;
        this.updateCoins(-this.brickButtons[this.selectedBrick].brick.cost);
      }

    }

    canBuild(brickType) {
      if (brickType)
        return this.brickButtons[brickType].brick.cost <= +this.registry.get("coins");
    }

    buildSmoke (offsetY = 10, offsetX) {
      Array(Phaser.Math.Between(8, 14)).fill(0).forEach(i => {
          const varX = Phaser.Math.Between(-20, 20);
          new JumpSmoke(this, this.x + (offsetX + varX), this.y + offsetY)
      })
    }

    finishScene () {
      if (this.theme) this.theme.stop();
      this.scene.start("transition", { name: "STAGE", number: this.number + 1});
    }

    startScene () {
      const customBricks = this.bricks.filter(brick => brick.active )
      this.time.delayedCall(1000, () => {
        if (this.theme) this.theme.stop();
        this.scene.start("game", { name: "STAGE", number: this.number, customBricks});
      },
      null,
      this
    );
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

    showPointer(time) {
      const {worldX, worldY}  = this.pointer;
      const point = new Phaser.Geom.Point(worldX, worldY);
      const distance = Phaser.Math.Distance.BetweenPoints(this.player, point);

      this.input.manager.canvas.style.cursor =  'crosshair';
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }

    recoverCoins (blockType) {
      this.updateCoins(this.brickButtons[this.selectedBrick].brick.cost);
    }

    updateCoins (amount = 1) {
      const coins = +this.registry.get("coins") + amount;
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
