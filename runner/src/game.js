import Player from "./player";
import Generator from "./generator";

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
      this.registry.set("score", "0")
        this.load.audio("coin", "assets/sounds/coin.mp3");
        this.load.audio("jump", "assets/sounds/jump.mp3");
        this.load.audio("dead", "assets/sounds/dead.mp3");
        this.load.audio("theme", "assets/sounds/theme.mp3");
        this.load.spritesheet('coin', './assets/images/coin.png',{ frameWidth: 32, frameHeight: 32 })
        this.load.bitmapFont("arcade", "assets/fonts/arcade.png", "assets/fonts/arcade.xml");
        this.score = 0;
    }

    create () {
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;

      this.cameras.main.setBackgroundColor(0x87ceeb);
      this.obstacles = this.add.group();
      this.coins = this.add.group();
      this.generator = new Generator(this);
      this.SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      this.player = new Player(this, this.center_width - 100, this.height - 200);
      this.scoreText = this.add.bitmapText(this.center_width, 10, "arcade", this.score, 20)
      this.physics.add.collider(this.player, this.obstacles, this.hitObstacle, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.coins, this.hitCoin, ()=>{
        return true;
      }, this);
      this.loadAudios(); 
      this.playMusic();

      this.input.on('pointerdown', (pointer) => this.jump(), this);
      this.updateScoreEvent = this.time.addEvent({ delay: 100, callback: () => this.updateScore(), callbackScope: this, loop: true });
    }

    hitObstacle (player, obstacle) {
      this.updateScoreEvent.destroy()
      this.finishScene();
    }

    hitCoin(player, coin) {
      this.playAudio("coin")
      this.updateScore(1000);
      coin.destroy();
    }

      loadAudios () {
        this.audios = {
          "jump": this.sound.add("jump"),
          "coin": this.sound.add("coin"),
          "dead": this.sound.add("dead"),
        };
      }

      playAudio(key) {
        this.audios[key].play();
      }

      playMusic (theme="theme") {
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
      if (Phaser.Input.Keyboard.JustDown(this.SPACE)) {
        this.jump();
      } else if (this.player.body.blocked.down) {
        this.jumpTween?.stop();
        this.player.rotation = 0;
        // ground
      }
    }

    jump () {
      if (!this.player.body.blocked.down) return
      this.player.body.setVelocityY(-300)
      
      this.playAudio("jump")
      this.jumpTween = this.tweens.add({
        targets: this.player,
        duration: 1000,
        angle: {from: 0, to: 360},
        repeat: -1
      })
    }

    finishScene () {
      this.theme.stop();
      this.playAudio("dead")
      this.registry.set("score", ""+this.score)
      this.scene.start("gameover");
     }

    updateScore (points = 1) {
        this.score += points;
        this.scoreText.setText(this.score);
    }
}