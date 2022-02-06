import Player from "./player";
import IceGenerator from "./ice_generator";
import Block from "./block";
import WaterPlatform from "./water_platform";

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
      this.addIceGenerator();

      this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 0);
      this.addScore();
      //this.loadAudios(); 
      // this.playMusic();
    }

    addMap () {
      this.platform = this.add.group();
      for (let i = 0; i < 15; i++) {
        this.platform.add(new Block(this, 64 * (i - 7), 0))
      }

      for (let i = 0; i < 16; i++) {
        this.platform.add(new Block(this, -7 * 64, i * -64, Phaser.Math.Between(0, 1)))
        this.platform.add(new Block(this, 7 * 64, i * -64, Phaser.Math.Between(0, 1)))
      }
      this.water = this.add.group();
      this.waterPlatform = new WaterPlatform(this)
    }

    addPlayer () {

      this.player = new Player(this, 0, -100, 1);

      this.physics.add.collider(this.player, this.platform, this.hitPlatform, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.water, this.hitWater, ()=>{
        return true;
      }, this);
    }

    addScore () {
      this.score = this.add.bitmapText(this.center_width - 200, 20, "pixelFont", String(this.registry.get("score")).padStart(8, '0') , 30).setOrigin(0.5).setScrollFactor(0)
    }

    addIceGenerator () {
      this.iceGenerator = new IceGenerator(this);
      this.ice = this.add.group();
      this.physics.add.collider(this.player, this.ice, this.hitIce, ()=>{
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

    hitPlatform(player, platform) {
    }

    hitWater(player, water) {
      player.dead = true;
      this.time.delayedCall(2000, ()=> { this.finishScene()}, null, true)
    }

      loadAudios () {
        this.audios = {
          "beam": this.sound.add("beam"),
        };
      }

      playAudio(key) {
        this.audios[key].play();
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
      this.player.update()
    }

    finishScene () {
     // this.theme.stop();
      this.scene.start("outro");
    }

    updateScore () {
        this.registry.set("score", Math.abs(Math.round(this.player.y)));
        this.score.setText(String(this.registry.get("score")).padStart(8, '0'));
    }
}
