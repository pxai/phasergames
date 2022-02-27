import ParticlGenerator from "./particle_generator";
import { Particle } from "./particle";
import Player from "./player";
import { Explosion } from "./trail";

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
      this.finished = false;
      this.addBackground();
      this.addPlayer();
      this.addGenerator();
      this.addScore();
      this.setKeys();
      this.physics.world.on('worldbounds', this.onWorldBounds.bind(this));
      this.loadAudios(); 
      this.playMusic();
    }

    setKeys () {
        this.ESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        this.input.mouse.disableContextMenu();
        this.input.on('pointerdown', (pointer) => this.setAttractor(pointer), this);
        this.input.on('pointerup', (pointer) => this.removeAttractor(pointer), this);
    }

    setAttractor (pointer) {
      if (this.player.life < 0 || this.attractor) return;

      if (pointer.rightButtonDown()) {
        this.playAudio("repel");
        this.attractor = new Particle(this, pointer.worldX, pointer.worldY, 0, 0, "particle3");
        this.player.repel(this.attractor);
      } else {
        this.playAudio("atract");
        this.attractor = new Particle(this, pointer.worldX, pointer.worldY, 0, 0, "particle4");
        this.player.attract(this.attractor);
      }


    }

    removeAttractor (pointer) {
      if (!this.attractor) return;

      this.attractor.destroy();
      this.attractor = null;
    }

    addPlayer () {
      this.trailLayer = this.add.layer();
      this.player = new Player(this, this.center_width, this.center_height)
    }
  
    addBackgroundColor() {
      this.cameras.main.setBackgroundColor(0x444444);
    } 

    addGenerator ()  {
      this.coins = this.add.group();
      this.particles = {
        "particle0": this.add.group(),
        "particle1": this.add.group(),
        "particle2": this.add.group()
      }
      this.particleGenerator = new ParticlGenerator(this)
      this.particleGenerator.generate();

      this.physics.add.collider(this.player, this.particles["particle0"], this.hitPlayerParticle0, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.particles["particle1"], this.hitPlayerParticle1, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.particles["particle2"], this.hitPlayerParticle2, ()=>{
        return true;
      }, this);


      this.physics.add.overlap(this.player, this.coins, this.pickCoin, ()=>{
        return true;
      }, this);
    }

    pickCoin(player, coin) {
      coin.destroy(true);
      this.playAudio("coin", 1)
      this.updateCoins();
    }

    hitPlayerParticle0(player, particle) {
      new Explosion(this, particle.x, particle.y, particle.type)

      this.updateLife(-300)
      particle.destroy();
      this.playAudio("hit");
      this.cameras.main.shake(200);
    }

    hitPlayerParticle1(player, particle) {
      new Explosion(this, particle.x, particle.y, particle.type)
      const points = this.player.life + 30 > 100 ? 100 - this.player.life : 30;
      this.updateLife(points)
      particle.destroy();
      this.playAudio("hit");
      this.cameras.main.shake(10);
    }

    hitPlayerParticle2(player, particle) {
      new Explosion(this, particle.x, particle.y, particle.type)

      this.updateLife(-10)
      particle.destroy();
      this.playAudio("hit");
      this.cameras.main.shake(50);
    }

    onWorldBounds (body, part) {
      const name = body.gameObject.name;

      if (name === "electron") this.playAudio("bump")
      if (["particle"].includes(name))
        body.gameObject.destroy();
    }
  
    addScore () {
      this.elapsedTime = 0;
      this.extraScoreTime = 0;
      this.lifeBarShadow = this.add.rectangle(this.width -150 , 35, 208, 24, 0x444444).setOrigin(0.5).setScrollFactor(0)
      this.lifeBar = this.add.rectangle(this.width - 149, 35, +this.registry.get("life") * 2 , 24, 0x253f47).setOrigin(0.5).setScrollFactor(0)
      this.lifeBar.width = +this.registry.get("life") * 2;
      this.lifeBar.setOrigin(0.5)
      this.scoreTextSec = this.add.bitmapText(this.center_width, 64, "visitor", "0.00", 40).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(1)
      this.scoreTextMillis = this.add.bitmapText(this.center_width, 30, "visitor", "0.00", 30).setDropShadow(0, 3, 0x222222, 0.9).setOrigin(0)
      this.time.addEvent({ delay: 100, callback: () =>{     
        this.elapsedTime += 100;    
        this.extraScoreTime += 100;    
        this.updateScore();
        if (this.extraScoreTime % 30_000 === 0) {
          this.extraScore(42_000)
          this.extraScoreTime = 0;
        }
      }, callbackScope: this, loop: true });
      this.scoreCoins = this.add.bitmapText(100, 30, "visitor", "x0", 40).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0)
      this.scoreCoinsLogo = this.add.sprite(64, 40, "coin").setOrigin(0.5)
      const coinAnimation = this.anims.create({
        key: "coin1",
        frames: this.anims.generateFrameNumbers("coin", { start: 0, end: 13 }, ),
        frameRate: 8,
      });
      this.scoreCoinsLogo.play({ key: "coin1", repeat: -1 });
    } 
      loadAudios () {
        this.audios = {
          "spawn": this.sound.add("spawn"),
          "atract": this.sound.add("atract"),
          "repel": this.sound.add("repel"),
          "powerup": this.sound.add("powerup"),
          "move": this.sound.add("move"),
          "death": this.sound.add("death"),
          "bump": this.sound.add("bump"),
          "click": this.sound.add("click"),
          "hit": this.sound.add("hit"),
          "coin": this.sound.add("coin"),
          "coinboom": this.sound.add("coinboom"),
        };
      }

      playAudio(key, volume=0.7) {
        this.audios[key].play({volume});
      }

      playRandomizedAudio(key) {
        this.audios[key].play({
          volume: Phaser.Math.Between(0.8, 0.4),
          rate:  Phaser.Math.Between(1, 0.7),
        });
      }

      playMusic (theme="music") {
        this.theme = this.sound.add(theme);
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

    addBackground () {
      this.background = this.add.tileSprite(0, 0, this.width, this.height, "stage1").setOrigin(0).setScrollFactor(0, 1); 
    }

    update() {
      this.particleGenerator.update();
      if (this.player.life >= 0) this.player.update();
      this.background.tilePositionY -= 15;
    }

    finishScene () {
      this.theme.stop();
      this.scene.start("outro", {next: "underwater", name: "STAGE", number: this.number + 1});
    }

    updateScore () {
        const scoreSec = Math.round(this.elapsedTime / 1000);
        const scoreMillis = this.elapsedTime % 1000;
        this.registry.set("score", this.elapsedTime);
        this.scoreTextSec.setText(scoreSec + ".");
        this.scoreTextMillis.setText(scoreMillis === 0 ? "000" : scoreMillis);
    }

    extraScore (points) {
      this.elapsedTime = this.elapsedTime + points;
      this.updateScore();
      this.tweens.add({
        targets: [this.scoreTextSec, this.scoreTextMillis],
        scale: { from: 1.4, to: 1},
        duration: 50,
        repeat: 10
      })
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

    updateLife (points) {
      this.player.life += points;
      if (this.player.life < 0) {
        this.playAudio("death");
        this.player.destroy();
        this.finished = true;
        this.time.delayedCall(500, ()=> this.finishScene(), null, this);
      } else {
        this.registry.set(this.player.life);
        this.lifeBar.width = +this.player.life * 2;
        this.tweens.add({
          targets: [this.lifeBar, this.lifeBarShadow],
          scale: { from: 1.2, to: 1},
          duration: 50,
          repeat: 5
        })
      }
    }
}
