import Player from "./player";
import Object from "./object";
import { Smoke, RockSmoke, ShotSmoke } from "./particle";
import places from "./places";
import Debris from "./debris";
import { Explosion } from "./steam";
import HorrifiPostFx from 'phaser3-rex-plugins/plugins/horrifipipeline.js';


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
      this.cameras.main.setBackgroundColor(0xae2012); 

      this.addLight();
      this.createMap();
      this.smokeLayer = this.add.layer();
      this.addPlayer();
      //this.addHelp();
      this.input.keyboard.on("keydown-ENTER", () => this.skipThis(), this);
      this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 0);
      this.addPosition();
      this.addDay();
      //this.addMineName();
      this.loadAudios(); 
      this.addEffects();
      this.playMusic();
      this.playOfficer();
    }

    addEffects() {

      this.cameras.main.setPostPipeline(HorrifiPostFx);
      /*const pipelineInstance = this.plugins.get('HorrifiPostFx').add(this.platform, {
        enable: false,
    
        // Bloom
        bloomEnable: false,
        bloomRadius: 0, bloomIntensity: 0, bloomThreshold: 0,
        bloomTexelWidth: 0, bloomTexelHeight: 0,
      });*/
    }

    addPosition() {
      this.positionText = this.add.bitmapText(this.center_width, 10, "pico", "x x x", 10).setOrigin(0.5).setScrollFactor(0)
      this.updatePosition(this.player.x, this.player.y)
    }

    addHelp () {
      if (this.number > 3) return;
      const help = [
        "Collect all the gold to clear the stage",
        "Pick shells to shoot ghosts, but they will respawn!",
        "Shoot at the walls if necessary",
        "Shoot at barrels and catch ghosts with the blast"
      ];
      this.helpText = this.add.bitmapText(this.center_width, this.center_height - 200, "pico", help[this.number], 20).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0.5).setScrollFactor(0)
      this.add.bitmapText(this.center_width, this.center_height + 340, "pico", "ENTER TO SKIP", 20).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0.5).setScrollFactor(0)

    }

    addDay() {
      this.dayText = this.add.bitmapText(20, 10, "pico", "Day " + (this.number + 1), 20).setOrigin(0).setScrollFactor(0)//.setDropShadow(0, 4, 0x222222, 0.9)
      //this.dayLogo = this.add.sprite(850, 28, "shell").setScale(0.8).setOrigin(0.5).setScrollFactor(0)
    }

    addMineName () {
      const name = "\"" + Phaser.Math.RND.pick(places) + "\"";
      this.mineName = this.add.bitmapText(this.center_width, 27, "pico", name, 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0.5).setScrollFactor(0)
    }

    addLight() {
        this.lights.disable();
        this.lights.setAmbientColor(0xae2012); // 0x707070
        this.playerLight = this.lights.addLight(0, 100, 100).setColor(0xffffff).setIntensity(3.0);
    }

    createMap() {
      this.tileMap = this.make.tilemap({ key: "scene" + this.number , tileWidth: 64, tileHeight: 64 });
      this.tileSetBg = this.tileMap.addTilesetImage("mars");
      this.tileMap.createStaticLayer('background', this.tileSetBg)//.setPipeline('Light2D');
  
      this.tileSet = this.tileMap.addTilesetImage("mars");
      this.platform = this.tileMap.createLayer('scene' + this.number, this.tileSet)//.setPipeline('Light2D');;
      this.border = this.tileMap.createLayer('border', this.tileSet)//.setPipeline('Light2D');;
      this.objectsLayer = this.tileMap.getObjectLayer('objects');
      this.border.setCollisionByExclusion([-1]);
      this.platform.setCollisionByExclusion([-1]);

      this.shells = this.add.group();
      this.foes = this.add.group();
      this.objects = this.add.group();
      this.createGrid();

      this.objectsLayer.objects.forEach( object => {
        if (object.name.startsWith("object")) {
          const [name, type, description] = object.name.split(":") 
          this.objects.add(new Object(this, object.x, object.y, type, description));
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

      this.physics.add.overlap(this.player, this.objects, this.touchObject, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.foes, this.playerHitByFoe, ()=>{
        return true;
      }, this);
    }

    hitFloor (player, platform) {
    }

    touchObject (player, object) {
      console.log("Touched! ", object.activated)
      if (!object.activated) {
        object.activated = true;
        object.touch();
      }
    }

    playerHitByFoe (player, foe) {
      this.cameras.main.shake(100);
      player.death();
      this.restartScene();
    } 

    loadAudios () {
        this.audios = {
          "mars_background": this.sound.add("mars_background"),
          "step": this.sound.add("step"),
        };
      }

      playAudio(key) {
        this.audios[key].play();
      }

      playRandom(key, volume = 1) {
        this.audios[key].play({
          rate: Phaser.Math.Between(0.9, 1),
          detune: Phaser.Math.Between(-500, 500),
          delay: 0,
          volume
        });
      }

      playOfficer () {
        this.sound.add(`officer${this.number}`).play();
      }

      playMusic () {
        const theme =  "mars_background";
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
        this.sound.add("creepy").play({
          mute: false,
          volume: 1,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
        })
        this.breathing = this.sound.add("breath")
        this.breath(0.2)
      }

    breath(rate = 0.2, volume = 0.4) {
      const duration = Phaser.Math.Between(500, 1000)
      this.tweens.add({
        targets:  this.breathing,
        volume:   0,
        duration,
        onComplete: () => {
          this.breathing.play({rate, volume})
        }
      });
      //this.breathing.stop();

    }

    update() {

    }

    restartScene () {
      this.theme.stop();
      this.time.delayedCall(3000, () => {
        this.scene.start("game", {number: this.number});
      }, null, this);
    }

    skipThis () {
      if (this.number > 3) return;
      this.player.dead = true;
      this.player.body.stop();
      this.theme.stop();
      this.scene.start("transition", { number: this.number + 1});
    }

    finishScene () {
      this.sound.stopAll();
      this.player.dead = true;
      this.player.body.stop();

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

    updatePosition (x, y , z = 0) {
      this.positionText.setText(`Lt: ${x} Lt: ${y} Lt: ${z}`);
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
