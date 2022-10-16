import Player from "./player";
import Shell from "./shell";
import Gold from "./gold";
import Tnt from "./tnt";
import Foe from "./foe";
import { Smoke, RockSmoke, ShotSmoke } from "./particle";
import places from "./places";
import Debris from "./debris";
import { Explosion } from "./steam";

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
      this.cameras.main.setBackgroundColor(0x000000); 
      this.addLight();
      this.createMap();
      this.smokeLayer = this.add.layer();
      this.addPlayer();
      this.addHelp();
      this.input.keyboard.on("keydown-ENTER", () => this.skipThis(), this);
      this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 100);
      this.addScore();
      this.addShells();
      this.addMineName();
      this.loadAudios(); 

      // this.playMusic();
    }

    addScore() {
      this.scoreText = this.add.bitmapText(75, 10, "shotman", "x" +this.registry.get("score"), 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0).setScrollFactor(0)
      this.scoreLogo = this.add.sprite(50, 28, "gold0").setScale(0.5).setOrigin(0.5).setScrollFactor(0)
    }

    addHelp () {
      if (this.number > 3) return;
      const help = [
        "Collect all the gold to clear the stage",
        "Pick shells to shoot ghosts, but they will respawn!",
        "Shoot at the walls if necessary",
        "Shoot at barrels and catch ghosts with the blast"
      ];
      this.helpText = this.add.bitmapText(this.center_width, this.center_height - 200, "pixelFont", help[this.number], 20).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0.5).setScrollFactor(0)
      this.add.bitmapText(this.center_width, this.center_height + 340, "pixelFont", "ENTER TO SKIP", 20).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0.5).setScrollFactor(0)

    }

    addShells() {
      this.shellText = this.add.bitmapText(875, 10, "shotman", "x" +this.player.shells, 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0).setScrollFactor(0)
      this.shellLogo = this.add.sprite(850, 28, "shell").setScale(0.8).setOrigin(0.5).setScrollFactor(0)
      const coinAnimation = this.anims.create({
        key: "shellscore",
        frames: this.anims.generateFrameNumbers("shell", { start: 0, end: 5 }, ),
        frameRate: 5,
      });
      this.shellLogo.play({ key: "shellscore", repeat: -1 });
    }

    addMineName () {
      const name = "\"" + Phaser.Math.RND.pick(places) + "\"";
      this.mineName = this.add.bitmapText(this.center_width, 27, "shotman", name, 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0.5).setScrollFactor(0)
    }

    addLight() {
      this.lights.enable();
      this.lights.setAmbientColor(0x707070);
      this.playerLight = this.lights.addLight(0, 100, 100).setColor(0xffffff).setIntensity(3.0);
    }

    createMap() {
      this.tileMap = this.make.tilemap({ key: "scene" + this.number , tileWidth: 64, tileHeight: 64 });
      this.tileSetBg = this.tileMap.addTilesetImage("cave");
      this.tileMap.createStaticLayer('background', this.tileSetBg).setPipeline('Light2D');
  
      this.tileSet = this.tileMap.addTilesetImage("cave");
      this.platform = this.tileMap.createLayer('scene' + this.number, this.tileSet).setPipeline('Light2D');;
      this.border = this.tileMap.createLayer('border', this.tileSet).setPipeline('Light2D');;
      this.objectsLayer = this.tileMap.getObjectLayer('objects');
      this.border.setCollisionByExclusion([-1]);
      this.platform.setCollisionByExclusion([-1]);

      this.shells = this.add.group();
      this.foes = this.add.group();
      this.fireballs = this.add.group();
      this.shots = this.add.group();
      this.blasts = this.add.group();
      this.tnts = this.add.group();
      this.golds = this.add.group();
      this.createGrid();

      this.objectsLayer.objects.forEach( object => {
        if (object.name.startsWith("shell")) {
          this.shells.add(new Shell(this, object.x + 16, object.y + 16));
        }

        if (object.name.startsWith("foe")) {
          this.foes.add(new Foe(this, object.x + 16, object.y + 16, this.grid));
        }

        if (object.name.startsWith("gold")) {
          this.golds.add(new Gold(this, object.x + 16, object.y + 16));
        }

        if (object.name.startsWith("tnt")) {
          this.tnts.add(new Tnt(this, object.x + 16, object.y + 16));
        }
      });

    }

    createGrid () {
      this.grid = [];

      Array(20).fill(0).forEach((_,i) => {
        this.grid[i] = []
        Array(20).fill(0).forEach((_, j) => {
          let rock = this.platform.getTileAt(Math.floor(j), Math.floor(i));
          let wall = this.border.getTileAt(Math.floor(j), Math.floor(i));
          this.grid[i][j] = (rock || wall) ?  1 : 0;
        });
    });
    }

    addPlayer () {
      this.trailLayer = this.add.layer();
      const playerPosition = this.objectsLayer.objects.find( object => object.name === "player")
      this.player = new Player(this, playerPosition.x, playerPosition.y);

      this.physics.add.collider(this.player, this.platform, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.border, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.tnts, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.foes, this.tnts, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.foes, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.shells, this.playerPickShell, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.golds, this.pickGold, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.fireballs, this.playerHitByFireball, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.foes, this.playerHitByFoe, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.shots, this.foes, this.foeHitByShot, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.shots, this.platform, this.shotHitPlatform, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.blasts, this.foes, this.foeHitByBlast, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.blasts, this.platform, this.blastHitPlatform, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.shots, this.tnts, this.tntHitByShot, ()=>{
        return true;
      }, this);
    }

    hitFloor (player, platform) {
    }

    pickGold (player, gold) {
      this.playAudio("gold");
      this.lights.removeLight(gold.light);
      gold.destroy()

      this.showPoints(player.x, player.y, "+1", 0xe5cc18)
      this.updateScore()

      if (this.isAllGoldTaken()) {
        this.finishScene()
      }
  }

    playerPickShell (player, shell) {
      this.lights.removeLight(shell.light);
      shell.destroy();
      this.playAudio("shell");
      player.shells++;
      this.showPoints(player.x, player.y, "+1")
      this.updateShells()
    }

    playerHitByFireball (player, fireball) {

    }

    playerHitByFoe (player, foe) {
      player.death();
      this.restartScene();
    } 

    foeHitByShot (shot, foe) {
      shot.destroy();
      foe.freeze();
      this.playAudio("ghostdead");
      Array(Phaser.Math.Between(8, 14)).fill(0).forEach( i => { this.smokeLayer.add(new Smoke(this, foe.x + 32, foe.y + 32, 0xb79860))});
    }

    foeHitByBlast (blast, foe) {
      this.playAudio("yee-haw")
      this.playAudio("ghost");
      Array(Phaser.Math.Between(20, 34)).fill(0).forEach( i => { this.smokeLayer.add(new Smoke(this, foe.x + 32, foe.y + 32, 0xb79860))});
      foe.destroy();
    }

    tntHitByShot (shot, tnt) {
      this.playAudio("explosion")
      Array(Phaser.Math.Between(4, 8)).fill(0).forEach( i => { this.smokeLayer.add(new RockSmoke(this, tnt.x, tnt.y))});
      this.blasts.add(new Explosion(this, tnt.x, tnt.y))
      shot.destroy();
      tnt.destroy();
    }

    shotHitPlatform (shot, tile) {
      if (!tile.collideDown) return;
      shot.destroy();
      Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this, tile.pixelX, tile.pixelY))
      this.platform.removeTileAt(tile.x, tile.y);
      Array(Phaser.Math.Between(4, 8)).fill(0).forEach( i => { this.smokeLayer.add(new RockSmoke(this, tile.pixelX, tile.pixelY))});
      const {x, y} = [
        {x: 0, y: -1},
        {x: 1, y: 0},
        {x: 0, y: 1},
        {x: -1, y: 0},
      ][this.player.lastDirection];
      Array(Phaser.Math.Between(4, 8)).fill(0).forEach( i => { this.smokeLayer.add(new ShotSmoke(this, tile.pixelX + (x * 64), tile.pixelY + (y * 64), x, y))});
      Array(Phaser.Math.Between(3,6)).fill(0).forEach( i => this.smokeLayer.add(new Debris(this, tile.pixelX  + 32 + (x * Phaser.Math.Between(16, 32)), tile.pixelY + 32 + (y * Phaser.Math.Between(16, 32)))))
      this.playAudio("stone")
    }

    blastHitPlatform (blast, tile) {
      if (!tile.collideDown) return;

      Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this, tile.pixelX, tile.pixelY))
      this.platform.removeTileAt(tile.x, tile.y);
      Array(Phaser.Math.Between(4, 8)).fill(0).forEach( i => { this.smokeLayer.add(new RockSmoke(this, tile.pixelX, tile.pixelY))});
      const {x, y} = [
        {x: 0, y: -1},
        {x: 1, y: 0},
        {x: 0, y: 1},
        {x: -1, y: 0},
      ][this.player.lastDirection];
      Array(Phaser.Math.Between(4, 8)).fill(0).forEach( i => { this.smokeLayer.add(new ShotSmoke(this, tile.pixelX + (x * 64), tile.pixelY + (y * 64), x, y))});
      Array(Phaser.Math.Between(3,6)).fill(0).forEach( i => this.smokeLayer.add(new Debris(this, tile.pixelX  + 32 + (x * Phaser.Math.Between(16, 32)), tile.pixelY + 32 + (y * Phaser.Math.Between(16, 32)))))
      this.playAudio("stone")
    }

      loadAudios () {
        this.audios = {
          "shell": this.sound.add("shell"),
          "gold": this.sound.add("gold"),
          "step": this.sound.add("step"),
          "explosion": this.sound.add("explosion"),
          "stone": this.sound.add("stone"),
          "yee-haw": this.sound.add("yee-haw"),
          "win": this.sound.add("win"),
          "shot": this.sound.add("shot"),
          "cock": this.sound.add("cock"),
          "ghost": this.sound.add("ghost"),
          "ghostdead": this.sound.add("ghostdead"),
          "dead": this.sound.add("dead"),
          "empty": this.sound.add("empty")
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

      playMusic (theme="game") {
        this.theme = this.sound.add(theme);
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

    }

    restartScene () {
      //this.theme.stop();
      this.time.delayedCall(3000, () => {
        this.scene.start("game", {number: this.number});
      }, null, this);
    }

    skipThis () {
      if (this.number > 3) return;
      this.player.dead = true;
      this.player.body.stop();
      this.scene.start("transition", { number: this.number + 1});
    }

    finishScene () {
      this.player.dead = true;
      this.player.body.stop();
      this.player.anims.play("playerwin", true);
      this.playAudio("yee-haw");
      this.playAudio("win");
      //this.theme.stop();
      this.time.delayedCall(3000, () => {
        this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1});
      }, null, this);
    }

    updateScore (points = 1) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText("x" + score);
    }

    showPoints (x, y, msg, color = 0xff0000) {
      let text = this.add.bitmapText(x + 20, y - 80, "pico", msg, 20).setDropShadow(2, 3, color, 0.7).setOrigin(0.5);
      this.tweens.add({
          targets: text,
          duration: 1000,
          alpha: {from: 1, to: 0},
          x: {from: text.x + Phaser.Math.Between(-10, 10), to: text.x + Phaser.Math.Between(-40, 40)},
          y: {from: text.y - 10, to: text.y - 60},
          onComplete: () => {
              text.destroy()
          }
      });
    }

    isAllGoldTaken () {
      return this.golds.getChildren().map(gold => gold.active).every(gold => !gold);
    }

    updateScore (points = 1) {
      const score = +this.registry.get("score") + points;
      this.registry.set("score", score);
      this.scoreText.setText("x"+ score);
      this.tweens.add({
        targets: [this.scoreLogo],
        scale: { from: 1, to: 0.5},
        duration: 100,
        repeat: 5
      })

      this.tweens.add({
        targets: [this.scoreText],
        scale: { from: 0.5, to: 1},
        duration: 100,
        repeat: 5
      })
  }

  updateShells (points = 1) {
    this.shellText.setText("x"+ this.player.shells);
    this.tweens.add({
      targets: [this.shellText, this.shellLogo],
      scale: { from: 0.5, to: 1},
      duration: 100,
      repeat: 5
    })
  }
}
