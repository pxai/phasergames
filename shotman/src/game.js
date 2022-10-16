import Player from "./player";
import Shell from "./shell";
import Gold from "./gold";
import Foe from "./foe";
import { Debris, Smoke } from "./particle";

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }

    init (data) {
      this.name = data.name;
      this.number = 0 //data.number;
  }

    preload () {
    }

    create () {
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      this.cameras.main.setBackgroundColor(0x8f532b);
      this.createMap();
      this.addPlayer();

      this.loadAudios(); 
      // this.playMusic();
    }


    createMap() {
      this.tileMap = this.make.tilemap({ key: "scene" + this.number , tileWidth: 64, tileHeight: 64 });
      this.tileSetBg = this.tileMap.addTilesetImage("background");
      this.tileMap.createStaticLayer('background', this.tileSetBg)
  
      this.tileSet = this.tileMap.addTilesetImage("cave");
      this.platform = this.tileMap.createLayer('scene' + this.number, this.tileSet);
      this.border = this.tileMap.createLayer('border', this.tileSet);
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
          this.shells.add(new Shell(this, object.x - 16, object.y - 16));
        }

        if (object.name.startsWith("foe")) {
          this.foes.add(new Foe(this, object.x - 16, object.y - 16, this.grid));
        }

        if (object.name.startsWith("gold")) {
          this.golds.add(new Gold(this, object.x - 16, object.y - 16));
        }
      });

    }

    createGrid () {
      this.grid = [];

      Array(20 * 64).fill(0).forEach((_,i) => {
          this.grid[i] = []
          Array(20 * 64).fill(0).forEach((_, j) => {
            let rock = this.platform.getTileAt(Math.floor(i/64), Math.floor(j/64));
            let wall = this.border.getTileAt(Math.floor(i/64), Math.floor(j/64));
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

      this.physics.add.overlap(this.shots, this.tnts, this.tntHitByShot, ()=>{
        return true;
      }, this);
    }

    hitFloor (player, platform) {
      console.log("Hit smt: ", platform)
    }

    pickGold (player, gold) {
      this.playAudio("gold");
      gold.destroy()
      //this.playAudio("gold");
      //let points = Phaser.Math.Between(1, 4);
      this.showPoints(player.x, player.y, "+1", 0xe5cc18)
      //this.updateScore(points);
  }

    playerPickShell (player, shell) {
      this.playAudio("shell");
      player.shells++;
      this.showPoints(player.x, player.y, "+1")
      shell.destroy();
    }

    playerHitByFireball (player, fireball) {

    }

    playerHitByFoe (player, foe) {

    } 

    foeHitByShot (shot, foe) {
      shot.destroy();
      foe.freeze();
    }

    foeHitByBlast (blast, foe) {

    }

    tntHitByShot (shot, tnt) {
      shot.destroy();
      tnt.destroy();
    }

    shotHitPlatform (shot, tile) {
      if (!tile.collideDown) return;
      console.log("HIT TILE?", tile)
      shot.destroy();
      Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this, tile.pixelX, tile.pixelY))
      this.platform.removeTileAt(tile.x, tile.y);
      new Smoke(this, tile.pixelX, tile.pixelY)
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
      this.sky.stop();
      this.theme.stop();
      this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1});
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
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
}
