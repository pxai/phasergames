import Player from "./player";
import IceGenerator from "./ice_generator";
import Block from "./block";
import WaterPlatform from "./water_platform";
import Star from "./star";
import Lightning from "./lightning";

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }

    init () {
  }

    preload () {
    }

    create () {
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
     // this.cameras.main.setBounds(0, 0, 10920 * 2, 10080 * 2);
     //this.cameras.main.setBounds(0, 0, 600, 600);
      this.physics.world.setBounds(0, 0, 10920 * 2, 10080 * 2);
      this.cameras.main.setBackgroundColor(0x64a7bd)
      this.background = this.add.image(450, 400, "background").setOrigin(0.5).setScrollFactor(0)
      this.addMap();
      this.addPlayer();
      this.addLittles();
      this.addIceGenerator();
      this.addWater();

      this.cameras.main.setBounds(-465, -10000000, 800, 10000000);
      this.cameras.main.startFollow(this.player) //, true, 0.05, 0.05, 0, 0);
      this.addScore();
      this.loadAudios(); 
      this.addSnow();
      this.playMusic();
      this.setLightning();
    }

    setLightning () {
      this.lightsOut = this.add.rectangle(0, 40, this.width + 200, this.height + 500, 0x0).setOrigin(0).setScrollFactor(0)
      this.lightsOut.setAlpha(0);
      this.lightningEffect = this.add.rectangle(0, 40, this.width + 200, this.height + 500, 0xffffff).setOrigin(0).setScrollFactor(0)
      this.lightningEffect.setAlpha(0);
      this.lightning = new Lightning(this);
    }

    addWater () {
      this.water = this.add.group();
      this.waterPlatform = new WaterPlatform(this)
      this.physics.add.overlap(this.player, this.water, this.hitWater, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.littles, this.water, this.hitWaterLittle, ()=>{
        return true;
      }, this);
    }

    addMap () {
      this.icesLayer = this.add.layer();
      this.platform = this.add.group();
      for (let i = 0; i < 15; i++) {
        this.platform.add(new Block(this, 64 * (i - 7), 0))
      }

      for (let i = 0; i < 16; i++) {
        this.platform.add(new Block(this, -7 * 64, i * -64, Phaser.Math.Between(0, 1)))
        this.platform.add(new Block(this, 7 * 64, i * -64, Phaser.Math.Between(0, 1)))
      }
    }

    addPlayer () {

      this.player = new Player(this, 0, -100, 1);
      this.physics.add.collider(this.player, this.platform, this.hitPlatform, ()=>{
        return true;
      }, this);
    }

    addLittles () {
      this.littles = this.add.group();
      this.physics.add.collider(this.littles, this.platform, this.hitPlatform, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.littles, this.player, this.rescueLittle, ()=>{
        return true;
      }, this);
    }

    addScore () {
      this.score = this.add.bitmapText(this.center_width, 20, "pixelFont", String(this.registry.get("score")).padStart(8, '0') , 30).setOrigin(0.5).setScrollFactor(0)
    }

    addIceGenerator () {
      this.iceGenerator = new IceGenerator(this);
      this.ice = this.add.group();
      this.iceBlock = this.add.group();

      this.physics.add.collider(this.player, this.ice, this.hitIce, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.iceBlock, this.hitIceBlock, ()=>{
        return true;
      }, this);
      this.iceGenerator.generate();
    }

    hitIce(player, ice) {
      if (player.jumping) {
        player.hitIce(ice);
        ice.touched();
      }
    }

    hitIceBlock(player, ice) {
    }

    hitPlatform(player, platform) {
    }

    rescueLittle (little, player) {
      little.destroy();
      this.playAudio("rescue")
      this.waterPlatform.goBack();
      Array(5).fill(0).forEach(star => {
        new Star(this, this.x + star, this.y + star)
      })
      this.playAudio("thankyou")
    }

    hitWater(player, water) {
      player.dead = true;
      player.body.enable = false;
      player.setAlpha(0)
      Array(5).fill(0).forEach(star => {
        new Star(this, player.x + star, player.y  + star + 32)
      })
      this.playAudio("water");
      this.tweens.add({
        targets: this.player,
        duration: 100,
        alpha: {from: 1, to: 0},
        repeat: -1
      })
      this.cameras.main.shake(500);
      this.time.delayedCall(1000, ()=> { this.finishScene()}, null, true)
    }

    hitWaterLittle(little, water) {
      this.playAudio("water");
      this.tweens.add({
        targets: little,
        duration: 100,
        alpha: {from: 1, to: 0},
        repeat: 1,
        onComplete: () => { little.destroy() }
      })
      this.cameras.main.shake(100);
    }

      loadAudios () {
        this.audios = {
          "flap": this.sound.add("flap"),
          "chirp": this.sound.add("chirp"),
          "hitice": this.sound.add("hitice"),
          "water": this.sound.add("water"),
          "rescue": this.sound.add("rescue"),
          "thankyou": this.sound.add("thankyou"),
          "thunder0": this.sound.add("thunder0"),
          "thunder1": this.sound.add("thunder1"),
          "thunder2": this.sound.add("thunder2"),
          "thunder3": this.sound.add("thunder3"),
        };
      }

      playAudio(key) {
        this.audios[key].play();
      }

      playRandom(key) {
        this.audios[key].play({
          rate: Phaser.Math.Between(1, 1.5),
          detune: Phaser.Math.Between(-1000, 1000),
          delay: 0
        });
      }

      playMusic (theme="music") {
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 0.6,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
      }

      addSnow() {
        this.particles = this.add.particles('flake');
        this.particles.setScrollFactor(0);
        this.emitter =  this.particles.createEmitter({
            alpha: { start: 1, end: 0 },
            scale: { start: 0.2, end: 1.5 },
            tint: [0xffffff, 0xeeeeee, 0xdddddd ],
            speed: 20,
            accelerationY: {min: 10, max: 15 },
            accelerationX: { min: -50, max: -100},
            angle: { min: -85, max: -95 },
            rotate: { min: -180, max: 180 },
            lifespan: { min: 10000, max: 11000 },
            blendMode: 'ADD',
            frequency: 110,
            maxParticles: -1,
            x: {min: 0, max: 900},
            y: -1000
        });
        this.emitter.startFollow(this.player, 800, -1000);
    }

    update() {
      this.player.update()
    }

    finishScene () {
      this.theme.stop();
      this.scene.start("outro");
    }

    updateScore () {
        this.registry.set("score", Math.abs(Math.round(this.player.y)));
        this.score.setText(String(this.registry.get("score")).padStart(8, '0'));
        this.textUpdateEffect(this.score, 0x3e6875)
    }

    textUpdateEffect (textElement, color) {
      textElement.setTint(color);
      this.tweens.add({
        targets: textElement,
        duration: 100,
        alpha: {from: 1, to: 0.8},
        repeat: 5,
        onComplete: () => {
          textElement.setTint(0xffffff);
        }
      });
     }
}
