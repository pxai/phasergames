
import Player from "./player";
import FoeGenerator from "./foe_generator";
import { Smoke, RockSmoke, ShotSmoke } from "./particle";
import Tnt from "./tnt";
import { Explosion } from "./steam";
import Gold from "./gold";

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
      this.registry.set("score", 0)
      this.registry.set("gold", 0)
    }


    create () {
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      //this.cameras.main.setBackgroundColor(0x663b1f);

      this.createMap();
      this.addLight();
      this.smokeLayer = this.add.layer();
      this.addPlayer();
      this.addScore();
      this.addShells();
      this.loadAudios();
      this.playMusic();
    }

    addScore() {
      this.seconds = 0;
      this.scoreText = this.add.bitmapText(this.center_width, 10, "default", this.registry.get("score"), 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0).setScrollFactor(0)
      this.timer = this.time.addEvent({ delay: 1000, callback: () => { this.updateSeconds()}, callbackScope: this, loop: true });

      this.goldText = this.add.bitmapText(this.width - 70, 10, "default", "x" +this.registry.get("gold"), 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0).setScrollFactor(0)
      this.goldLogo = this.add.sprite(this.width - 100, 28, "gold0").setScale(0.5).setOrigin(0.5).setScrollFactor(0)
    }

    addLight() {
      this.lights.enable();
      this.lights.setAmbientColor(0x707070);
      this.playerLight = this.lights.addLight(0, 300, 300).setColor(0xffffff).setIntensity(3.0);
    }

    addShells() {
      this.shellText = this.add.bitmapText(30, 10, "default", "x" +this.player.shells, 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0).setScrollFactor(0)
      this.shellLogo = this.add.sprite(10, 28, "shell").setScale(0.8).setOrigin(0.5).setScrollFactor(0)
      const coinAnimation = this.anims.create({
        key: "shellscore",
        frames: this.anims.generateFrameNumbers("shell", { start: 0, end: 5 }, ),
        frameRate: 5,
      });
      this.shellLogo.play({ key: "shellscore", repeat: -1 });
    }

    createMap () {
      this.tileMap = this.make.tilemap({ key: "scene" , tileWidth: 64, tileHeight: 64 })
      this.tileSet = this.tileMap.addTilesetImage("cave");
      this.background = this.tileMap.createLayer('background', this.tileSet).setPipeline('Light2D');
      this.platform = this.tileMap.createLayer('scene', this.tileSet).setPipeline('Light2D');
      this.objectsLayer = this.tileMap.getObjectLayer('objects');
     // this.background.fill(6);
      this.platform.setCollisionByExclusion([-1]);

      this.shells = this.add.group();
      this.foes = this.add.group();
      this.fireballs = this.add.group();
      this.shots = this.add.group();
      this.blasts = this.add.group();
      this.tnts = this.add.group();
      this.golds = this.add.group();
      this.foeGenerator = new FoeGenerator(this);
    }

    addPlayer () {
      this.player = new Player(this, this.center_width, this.center_height);
      this.cameras.main.startFollow(this.player);

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

    playerHitByFoe (player, foe) {
      if (foe.harmless) return;
      this.cameras.main.shake(10);
      const {x, y} = foe;
      player.hit(x, y, 10);
      this.playAudio("hit");
      foe.destroy();
      //this.restartScene();
    }

    foeHitByShot (shot, foe) {
      this.lights.removeLight(shot.light);
      shot.destroy();
      this.playAudio("ghost");
      this.playAudio("ghostdead");
      Array(Phaser.Math.Between(8, 14)).fill(0).forEach( i => { this.smokeLayer.add(new Smoke(this, foe.x + 32, foe.y + 32, 0xb79860))});
      foe.destroy();
      this.updateScore()
      if (Phaser.Math.Between(1, 10) > 4) {
        this.tnts.add(new Tnt(this, foe.x, foe.y));
      } else if (Phaser.Math.Between(1, 10) > 4) {
        this.golds.add(new Gold(this, foe.x, foe.y));
      }
    }

    foeHitByBlast (blast, foe) {
      this.playAudio(Phaser.Math.RND.pick(["yee-haw", "sons", "goddam", "sons"]))
      this.playAudio("ghost");
      this.updateScore(10)
      Array(Phaser.Math.Between(20, 34)).fill(0).forEach( i => { this.smokeLayer.add(new Smoke(this, foe.x + 32, foe.y + 32, 0xb79860))});
      foe.destroy();
      this.golds.add(new Gold(this, foe.x, foe.y));
    }

    tntHitByShot (shot, tnt) {
      this.lights.removeLight(tnt.light);
      this.lights.removeLight(shot.light);
      this.playAudio("explosion")
      this.cameras.main.shake(500);
      Array(Phaser.Math.Between(4, 8)).fill(0).forEach( i => { this.smokeLayer.add(new RockSmoke(this, tnt.x, tnt.y))});
      this.blasts.add(new Explosion(this, tnt.x, tnt.y))
      shot.destroy();
      tnt.destroy();
    }

    playerPickShell (player, shell) {
      this.lights.removeLight(shell.light);
      shell.destroy();
      this.playAudio("shell");
      player.shells++;
      this.showPoints(player.x, player.y, "+1")
      this.updateShells()
    }

    pickGold (player, gold) {
      this.lights.removeLight(gold.light);
      this.updateGold(1)
      this.player.gold++;
      this.playAudio("gold");
      this.lights.removeLight(gold.light);
      gold.destroy()
      console.log("Gold: ", this.player.gold)
      if (this.player.gold === 10) {
        console.log("Increase health!!: ", this.player.gold)
        this.player.healthBar.increase(20)
        this.player.showHealth();
        this.updateGold(-10)
        this.player.gold = 0;
        this.playAudio("health")
      }

      this.showPoints(player.x, player.y, "+1", 0xe5cc18)
      this.updateScore()

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
        "hit": this.sound.add("ghostdead"),
        "dead": this.sound.add("dead"),
        "sons": this.sound.add("sons"),
        "goddam": this.sound.add("goddam"),
        "empty": this.sound.add("empty"),
        "health": this.sound.add("health")
      };
    }

    playAudio(key) {
      this.audios[key].play({
        volume: 0.5,
    });
    }

    playRandom(key, volume = 1) {
      this.audios[key].play({
        rate: Phaser.Math.Between(1, 1.5),
        detune: Phaser.Math.Between(-1000, 1000),
        delay: 0,
        volume: Phaser.Math.Between(0.4, 0.9)
      });
    }

      playMusic (theme="music") {
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

    finishScene () {
      if (this.theme) this.theme.stop();
      this.scene.start("outro");
    }

    updateScore (points = 1) {
      const score = +this.registry.get("score") + points;
      this.registry.set("score", score);
      this.scoreText.setText(score);
    }

    updateSeconds (points = 1) {
      this.seconds++;
      if (this.seconds % 20 === 0 && this.foeGenerator.frequency > 300) {
        this.foeGenerator.setFrequency(this.foeGenerator.frequency - 100);
      }
  }

    showPoints (x, y, msg, color = 0xff0000) {
      let text = this.add.bitmapText(x + 20, y - 80, "default", msg, 20).setDropShadow(2, 3, color, 0.7).setOrigin(0.5);
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

    updateGold (points = 1) {
      const score = +this.registry.get("gold") + points;
      this.registry.set("gold", score);
      this.goldText.setText("x" + score);
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
