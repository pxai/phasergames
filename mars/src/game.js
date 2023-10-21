import Player from "./player";
import Object from "./object";
import Drone from "./drone";
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

  /*

  */
    create () {
      this.backgroundColors = [
        0xae2012, 0x961C10, 0x50120A, 0x40120A,
        0x30120A, 0x2F120A, 0x000000
      ];
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      this.cameras.main.setBackgroundColor(this.backgroundColors[this.number ]);

      this.addLight();
      this.createMap();
      this.smokeLayer = this.add.layer();
      this.addPlayer();
      this.addOxygen();

      this.input.keyboard.on("keydown-ENTER", () => this.skipThis(), this);
      this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 0);
      this.loadAudios();
      this.addEffects();
      this.playMusic();
    }

  /*

  */
  addOxygen () {
    this.oxygenBar = this.add.rectangle(this.center_width, 40, this.player.oxygen * 1.8, 20, 0x6b140b).setOrigin(0.5).setScrollFactor(0)
  }

  /*

  */
  addEffects() {
    this.cameras.main.setPostPipeline(HorrifiPostFx);
  }

  /*

  */
    addDay() {
      this.dayText = this.add.bitmapText(20, 10, "pico", "Day " + (this.number + 1), 20)
        .setTint(0x6b140b).setOrigin(0).setScrollFactor(0).setDropShadow(0, 2, 0x6b302a, 0.9)
    }

  /*

  */
    addLight() {
        this.lights.disable();
        this.lights.setAmbientColor(0xae2012); // 0x707070
        this.playerLight = this.lights.addLight(0, 100, 100).setColor(0xffffff).setIntensity(3.0);
    }

  /*

  */
    createMap() {
      this.tileMap = this.make.tilemap({ key: "scene" + this.number , tileWidth: 64, tileHeight: 64 });
      this.tileSetBg = this.tileMap.addTilesetImage("mars");
      this.tileSet = this.tileMap.addTilesetImage("mars");
      this.platform = this.tileMap.createLayer('scene' + this.number, this.tileSet);
      this.border = this.tileMap.createLayer('border', this.tileSet);
      this.objectsLayer = this.tileMap.getObjectLayer('objects');
      this.border.setCollisionByExclusion([-1]);
      this.platform.setCollisionByExclusion([-1]);

      this.holes = this.add.group();
      this.foes = this.add.group();
      this.objects = this.add.group();
      this.createGrid();
      this.addObjects();
    }

    addObjects () {
      this.objectsLayer.objects.forEach( object => {
        if (object.name.startsWith("object")) {
          const [name, type, description, extra] = object.name.split(":")
          this.objects.add(new Object(this, object.x, object.y, type, description, extra));
        }

        if (object.name.startsWith("drone")) {
          this.foes.add(new Drone(this, object.x, object.y, this.grid));
        }
      });
    }

  /*

  */
    createGrid () {
      this.grid = [];

      Array(40).fill(0).forEach((_,i) => {
        this.grid[i] = []
        Array(40).fill(0).forEach((_, j) => {
          let rock = this.platform.getTileAt(Math.floor(j), Math.floor(i));
          let wall = this.border.getTileAt(Math.floor(j), Math.floor(i));
          this.grid[i][j] = (rock || wall) ?  1 : 0;
        });
    });
    }

  /*

  */
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

      this.physics.add.overlap(this.player, this.holes, this.playerHitHole, ()=>{
        return true;
      }, this);
    }

    hitFloor (player, platform) {
    }

  /*

  */
    touchObject (player, object) {
      if (object.type === "hole") this.playTracker()
      if (!object.activated) {
        object.activated = true;
        object.touch();
      }
    }

  /*

  */
    playerHitByFoe (player, foe) {
      this.cameras.main.shake(100);
      this.playAudio("killed")
      player.death();
      this.restartScene();
    }

  /*

  */
    playerHitHole(player, hole) {
      if (!player.dead) {
        this.playAudio("holeshout")
        hole.setAlpha(1)
        player.setAlpha(0);
        this.cameras.main.shake(50);
        player.death();
        this.restartScene();
      }
    }

  /*

  */
    loadAudios () {
        this.audios = {
          "mars_background": this.sound.add("mars_background"),
          "step": this.sound.add("step"),
          "kill": this.sound.add("kill"),
          "blip": this.sound.add("blip"),
          "ohmygod": this.sound.add("ohmygod"),
          "holeshout": this.sound.add("holeshout"),
          "oxygen": this.sound.add("oxygen"),
          "shock": this.sound.add("shock"),
          "killed": this.sound.add("killed"),
        };
        this.tracker = this.sound.add("tracker");
    }

  /*

  */
    playRandomStatic () {
      const file = this.number < 6 ? "static" + Phaser.Math.Between(0,3) : "creepy_static"
      this.sound.add(file).play({
        rate: Phaser.Math.Between(9, 11)/10,
        delay: 0,
        volume: Phaser.Math.Between(5, 10)/10
      });
    }

  /*

  */
  playTracker () {
    if (!this.tracker.isPlaying) this.tracker.play();
  }

  /*

  */
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

  /*

  */
    playOfficer () {
      this.sound.add(`officer${this.number}`).play();
    }

  /*

  */
      playMusic () {
        const theme =  this.number < 6 ? "mars_background" : "cave";
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 1.5,
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
        volume: 0,
        duration,
        onComplete: () => {
          this.breathing.play({rate, volume})
        }
      });
    }


  /*

  */
    restartScene () {
      const x = this.cameras.main.worldView.centerX;
      const y = this.cameras.main.worldView.centerY;

      this.fadeBlack = this.add.rectangle(x - 100, y - 50, 10000, 11000,  0x000000).setOrigin(0.5)
      this.failure = this.add.bitmapText(x, y, "pico", "FAILURE", 40).setTint(0x6b140b)
        .setOrigin(0.5).setDropShadow(0, 2, 0x6b302a, 0.9)

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

  /*

  */
    skipThis () {
      //if (this.number > 3) return;
      this.player.dead = true;
      this.player.body.stop();
      this.theme.stop();
      this.scene.start("transition", { number: this.number + 1});
    }

  /*

  */
    finishScene (mute = true) {
      const x = this.cameras.main.worldView.centerX;
      const y = this.cameras.main.worldView.centerY;

      this.fadeBlack = this.add.rectangle(x - 100, y - 50, 2000, 2000,  0x000000).setOrigin(0.5)

      this.tweens.add({
        targets: [this.fadeBlack],
        alpha: {from: 0, to: 1},
        duration: 3000
      })

      this.player.dead = true;
      this.player.body.stop();
      if (this.mute) this.sound.add("blip").play();
      this.time.delayedCall(3000, () => {
        if (this.mute) this.sound.stopAll();
        this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1});
      }, null, this);
    }

  /*

  */
    updateOxygen () {
      this.oxygenBar.width = this.player.oxygen * 1.8;
    }
}
