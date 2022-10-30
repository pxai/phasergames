import Explosion from "./explosion";
import FoeGenerator from "./foe_generator";
import ObstacleGenerator from "./obstacle_generator";
import Player from "./player";


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
      this.addScenario();
      this.addFoes();
      this.addPlayer();
      this.cameras.main.startFollow(this.player, true, 0.05, 0.05, -300, -50);
      this.loadAudios(); 
      //this.playMusic();
      this.addScore();
      this.addBullets();
    }

    addBullets() {
      this.bulletText = this.add.bitmapText(75, 10, "pico", 0, 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0).setScrollFactor(0)
      this.bulletLogo = this.add.sprite(50, 28, "bullet").setScale(0.5).setOrigin(0.5).setScrollFactor(0)
    }

    addScore() {
      this.scoreText = this.add.bitmapText(this.center_width, 10, "pico", this.registry.get("score"), 40).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0.5).setScrollFactor(0)
    }

    addScenario () {
      this.background = this.add.tileSprite(0, 0, 0, 0, "road").setOrigin(0).setScrollFactor(0, 1);
      this.trees = this.add.group();
      this.obstacles = this.add.group();
      this.bullets = this.add.group();
      this.boxes = this.add.group();
      this.explosions = this.add.group();
    }

    addFoes () {
      this.foes = this.add.group();
      this.foeGenerator = new FoeGenerator(this);
      this.obstacleGenerator = new ObstacleGenerator(this)
    }

    addPlayer() {
      this.thrust = this.add.layer();
      this.player = new Player(this, 50, this.center_height)

      this.physics.add.collider(this.player, this.foes, this.hitFoe, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.trees, this.hitTree, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.obstacles, this.hitObstacle, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.bullets, this.obstacles, this.bulletObstacle, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.bullets, this.foes, this.bulletFoe, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.boxes, this.pickBox, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.foes, this.explosions, this.foeExplosion, ()=>{
        return true;
      }, this)

      this.physics.add.overlap(this.obstacles, this.explosions, this.obstacleExplosion, ()=>{
        return true;
      }, this)
    }

    foeExplosion (foe, explosion) {
      this.explosions.add(new Explosion(this, foe.x, foe.y))
      foe.destroy();
      explosion.destroy();
    }

    obstacleExplosion (foe, obstacle) {
      obstacle.destroy();
      explosion.destroy();
    }

    hitFoe (player, foe) {
      if (player.jumping) return;
      player.destroy();
      this.explosions.add(new Explosion(this, foe.x, foe.y))
      foe.destroy();
    }

    hitTree (player, tree) {
      if (player.jumping) return;
      this.explosions.add(new Explosion(this, player.x, player.y))
      player.destroy();
    }

    hitObstacle (player, obstacle) {
      if (player.jumping) return;
      this.explosions.add(new Explosion(this, player.x, player.y))
      player.destroy();
      obstacle.destroy();
    }

    pickBox (player, box) {
      player.addBullets(Phaser.Math.Between(3, 5));
      this.updateBullets();
      box.destroy();
    }

    bulletFoe (bullet, foe) {
      this.explosions.add(new Explosion(this, bullet.x, bullet.y))
      bullet.destroy()
      foe.destroy();
    }

    bulletObstacle (bullet, obstacle) {
      bullet.destroy()
      obstacle.destroy();
    }

      loadAudios () {
        this.audios = {
          "explosion": this.sound.add("explosion"),
        };
      }

      playAudio(key) {
        this.audios[key].play();
      }

      playMusic (theme="music") {
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
      this.background.setTilePosition(this.cameras.main.scrollX);
    }

    restartScene () {
      const x = this.cameras.main.worldView.centerX;
      const y = this.cameras.main.worldView.centerY;

      this.fadeBlack = this.add.rectangle(x - 100, y - 50, 10000, 11000,  0x000000).setOrigin(0.5)
      this.failure = this.add.bitmapText(x, y, "pico", "FAILURE", 40).setTint(0x6b140b).setOrigin(0.5).setDropShadow(0, 2, 0x6b302a, 0.9)

      this.tweens.add({
        targets: [this.failure, this.fadeBlack],
        alpha: {from: 0, to: 1},
        duration: 2000
      })
      this.time.delayedCall(3000, () => {
        this.sound.stopAll();
        this.scene.start("game", {number: this.number});
      }, null, this);
    }

    finishScene () {
    //  this.sky.stop();
    //this.theme.stop();
      this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1});
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(score);
    }

    updateBullets (points = 1) {
    this.bulletText.setText("x"+ this.player.bullets);
    this.tweens.add({
      targets: [this.bulletText, this.bulletLogo],
      scale: { from: 0.5, to: 1},
      duration: 100,
      repeat: 5
    })
  }
}
