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
      this.cameras.main.setBackgroundColor(0x258f00);
      this.addScenario();
      this.addFoes();
      this.addPlayer();
      this.cameras.main.startFollow(this.player, true, 0.05, 0.05, -300, -50);
      this.loadAudios(); 
      this.playMusic();
      this.addScore();
      this.addBullets();
    }

    addBullets() {
      this.bulletText = this.add.bitmapText(75, 10, "pico", 0, 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0).setScrollFactor(0)
      this.bulletLogo = this.add.sprite(50, 28, "bullet").setScale(0.5).setOrigin(0.5).setScrollFactor(0)
    }

    addScore() {
      this.scoreText = this.add.bitmapText(this.center_width, 20, "pico", this.registry.get("score"), 40).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0.5).setScrollFactor(0)
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
      this.otherExplosion(foe)
      foe.destroy();
      this.thrust.add(this.add.sprite(foe.x, foe.y, "mark"))
      explosion.destroy();
    }

    obstacleExplosion (foe, obstacle) {
      obstacle.destroy();
      this.otherExplosion(obstacle)
      this.thrust.add(this.add.sprite(obstacle.x, obstacle.y, "mark", 1))
      explosion.destroy();
    }

    hitFoe (player, foe) {
      if (player.jumping) return;
      player.destroy();
      this.otherExplosion(foe);
      foe.destroy();
      this.thrust.add(this.add.sprite(foe.x, foe.y, "mark"))
      this.playerExplosion();
      this.thrust.add(this.add.sprite(player.x, player.y, "mark"))

    }

    hitTree (player, tree) {
      if (player.jumping) return;
      this.playerExplosion();
      player.destroy();
      this.thrust.add(this.add.sprite(player.x, player.y, "mark"))
    }

    hitObstacle (player, obstacle) {
      if (player.jumping) return;
      this.playerExplosion();
      player.destroy();
      this.thrust.add(this.add.sprite(player.x, player.y, "mark"))
      this.otherExplosion(obstacle);
      this.thrust.add(this.add.sprite(obstacle.x, obstacle.y, "mark", 1))
      obstacle.destroy();
    }

    pickBox (player, box) {
      player.addBullets(Phaser.Math.Between(3, 5));
      this.updateBullets();
      box.destroy();
    }

    bulletFoe (bullet, foe) {
      this.otherExplosion(foe);
      bullet.destroy()
      foe.destroy();
      this.thrust.add(this.add.sprite(foe.x, foe.y, "mark"))
    }

    bulletObstacle (bullet, obstacle) {
      bullet.destroy()
      this.otherExplosion(obstacle);
      obstacle.destroy();
      this.thrust.add(this.add.sprite(obstacle.x, obstacle.y, "mark", 1))
    }

    otherExplosion (other) {
      Array(Phaser.Math.Between(2, 4)).fill(0).forEach((_, i) => {
        const scale = Phaser.Math.Between(1, 5) / 10;
        const offsetX = Phaser.Math.Between(-32, 32)
        const offsetY = Phaser.Math.Between(-32, 32)
        this.explosions.add(new Explosion(this, other.x + offsetX, other.y + offsetY, scale))
      })
    }

    playerExplosion () {
      Array(Phaser.Math.Between(3, 6)).fill(0).forEach((_, i) => {
        const scale = Phaser.Math.Between(1, 10) / 10;
        const offsetX = Phaser.Math.Between(-32, 32)
        const offsetY = Phaser.Math.Between(-32, 32)
        this.explosions.add(new Explosion(this, this.player.x + offsetX, this.player.y + offsetY, scale))
      })
    }

      loadAudios () {
        this.engine = this.sound.add("engine")
        this.brake = this.sound.add("brake");

        this.turn = this.sound.add("turn");
        this.audios = {
          "explosion": this.sound.add("explosion"),
          "shot": this.sound.add("shot"),
          "box": this.sound.add("box"),
          "idle": this.sound.add("idle"),
          "brake": this.sound.add("brake"),
          "jump": this.sound.add("jump"),
          "land": this.sound.add("land"),
        };
      }

      playEngine(rate = 0.5, volume = 0.5) {
        if (!this.engine.isPlaying) {
          this.engine.play({
            rate: Phaser.Math.Between(8, 12)/10,
            volume: Phaser.Math.Between(5, 10)/10
          });
        }
      }

      playBrake() {
        if (!this.brake.isPlaying) {
          this.brake.play();
        }
      }

      playTurn() {
        if (!this.turn.isPlaying) {
          this.turn.play();
        }
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
      this.failure = this.add.bitmapText(x + 200, y, "race", "GAME OVER", 160).setTint(0xffffff).setOrigin(0.5).setDropShadow(0, 2, 0x6b302a, 0.9)

      this.tweens.add({
        targets: [this.failure, this.fadeBlack],
        alpha: {from: 0, to: 1},
        duration: 2000
      })
      this.time.delayedCall(3000, () => {
        this.sound.stopAll();
        this.scene.start("transition", {number: this.number});
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
