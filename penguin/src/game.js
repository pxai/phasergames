import Player from "./player";
import IceGenerator from "./ice_generator";
import Block from "./block";
import WaterPlatform from "./water_platform";
import Star from "./star";

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
      this.score = this.add.bitmapText(this.center_width - 200, 20, "pixelFont", String(this.registry.get("score")).padStart(8, '0') , 30).setOrigin(0.5).setScrollFactor(0)
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
      this.playAudio("water");
      this.tweens.add({
        targets: this.player,
        duration: 100,
        alpha: {from: 1, to: 0},
        repeat: -1
      })
      this.time.delayedCall(2000, ()=> { this.finishScene()}, null, true)
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
    }

      loadAudios () {
        this.audios = {
          "flap": this.sound.add("flap"),
          "chirp": this.sound.add("chirp"),
          "hitice": this.sound.add("hitice"),
          "water": this.sound.add("water"),
          "rescue": this.sound.add("rescue"),
          "thankyou": this.sound.add("thankyou"),
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
        this.particles.createEmitter({
            alpha: { start: 1, end: 0 },
            scale: { start: 0.2, end: 1.5 },
            tint: [0xffffff, 0xeeeeee, 0xdddddd ],
            speed: 20,
            accelerationY: {min: 10, max: 50 },
            angle: { min: -85, max: -95 },
            rotate: { min: -180, max: 180 },
            lifespan: { min: 10000, max: 11000 },
            blendMode: 'ADD',
            frequency: 110,
            maxParticles: -1,
            x: {min: -500, max: 500},
            y: this.player.y - 600
        });
  
    }

    update() {
      this.player.update()
      if (this.player && !this.player.jumping)
        this.particles.y = this.player.y - 700;
      //this.cameras.main.y = this.player.y;
    }

    finishScene () {
      this.theme.stop();
      this.scene.start("outro");
    }

    updateScore () {
        this.registry.set("score", Math.abs(Math.round(this.player.y)));
        this.score.setText(String(this.registry.get("score")).padStart(8, '0'));
    }
}
