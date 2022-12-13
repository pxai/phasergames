import Player from "./player";
import Object from "./object";
import { Smoke, RockSmoke, ShotSmoke } from "./particle";
import Drone from "./drone";
import { Explosion } from "./steam";
import Lightning from "./lightning";
import Weather from "./weather";


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
      this.backgroundColors = [
        0xae2012, 0x961C10, 0x50120A, 0x40120A,
        0x30120A, 0x2F120A, 0x000000
      ];
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      //this.cameras.main.setBackgroundColor(0xcccccc); 
      this.setLightning();
      this.addWeather();

      this.createMap();
      this.smokeLayer = this.add.layer();
      this.addLight();
      this.addPlayer();
      this.addName();

      //this.input.keyboard.on("keydown-ENTER", () => this.skipThis(), this);
      this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 0);
      this.loadAudios(); 
      this.playMusic();
      this.foundBobby = false;
    //  this.input.keyboard.on("keydown-SPACE", () => this.finishScene(), this);
      this.time.delayedCall(2000, () => { this.playBobby()}, null,this);
    }

    setLightning () {
      //this.lightsOut = this.add.rectangle(0, 0, this.width + 200, this.height + 500, 0x0).setOrigin(0).setScrollFactor(0)
      //this.lightsOut.setAlpha(0);
      this.lightningEffect = this.add.rectangle(0, 0, this.width + 200, this.height + 500, 0xffffff).setOrigin(0).setScrollFactor(0)
      this.lightningEffect.setAlpha(0);
      this.lightning = new Lightning(this);
    }

    addWeather () {
      const weather = ["rain", "rain", "snow"];
      new Weather(this, weather[this.number]);
    }

    addOxygen () {
      //this.checkManaEvent = this.time.addEvent({ delay: 1000, callback: this.recoverMana, callbackScope: this, loop: true });
      this.oxygenBar = this.add.rectangle(this.center_width, 40, this.player.oxygen * 1.8, 20, 0x6b140b).setOrigin(0.5).setScrollFactor(0)
    }

    addName() {
      const names = ["DAD", "MOM", "JOBETH"];
      this.positionText = this.add.bitmapText(this.center_width, 20, "dark", names[this.number], 45).setTint(0xffffff).setOrigin(0.5).setScrollFactor(0).setDropShadow(0, 2, 0xcccccc, 0.9)
      this.bobbyTalk = this.add.bitmapText(this.center_width, 100, "dark", "", 65).setTint(0xffffff).setOrigin(0.5).setScrollFactor(0).setDropShadow(0, 2, 0xcccccc, 0.9)
    }

    addDay() {
      this.dayText = this.add.bitmapText(20, 10, "dark", "Day " + (this.number + 1), 20).setTint(0xffffff).setOrigin(0).setScrollFactor(0).setDropShadow(0, 2, 0xcccccc, 0.9)
      //this.dayLogo = this.add.sprite(850, 28, "shell").setScale(0.8).setOrigin(0.5).setScrollFactor(0)
    }

    addLight() {
      this.lights.enable();
      this.lights.setAmbientColor(0x0d0d0d);
      this.playerLight = this.lights.addLight(0, 200, 200).setColor(0xffffff).setIntensity(3.0);
    }

    createMap() {
      this.tileMap = this.make.tilemap({ key: "scene0" , tileWidth: 64, tileHeight: 64 });
      this.tileSetBg = this.tileMap.addTilesetImage("forest");
      this.tileMap.createStaticLayer('background', this.tileSetBg).setPipeline('Light2D');
  
      this.tileSet = this.tileMap.addTilesetImage("forest");
      this.platform = this.tileMap.createLayer('scene0', this.tileSet).setPipeline('Light2D');;
      this.border = this.tileMap.createLayer('border', this.tileSet)//.setPipeline('Light2D');;
      this.objectsLayer = this.tileMap.getObjectLayer('objects');
      this.border.setCollisionByExclusion([-1]);
      this.platform.setCollisionByExclusion([-1]);

      this.holes = this.add.group();
      this.monsters = this.add.group();
      this.tent = this.add.group();
      this.objects = this.add.group();
      this.createGrid();
      let bobbies = 0;
      const bobby = +this.registry.get("bobby")
      this.objectsLayer.objects.forEach( object => {
        if (object.name.startsWith("object")) {
          const [name, type, description, extra] = object.name.split(":")
          if (type !== "bobby" && type !== "braun") {
            this.objects.add(new Object(this, object.x, object.y, type, description, extra));
          }

          if (type === "braun" && Phaser.Math.Between(0, 100) > 50) {
            this.objects.add(new Object(this, object.x, object.y, type, description, extra));
          }

          if (type === "ending" && Phaser.Math.Between(0, 100) > 67) {
            this.objects.add(new Object(this, object.x, object.y, type, description, extra));
          }

          if (type === "bobby" && bobbies === bobby) {
            this.bobby = new Object(this, object.x, object.y, type, description, extra)
            this.objects.add(this.bobby);
          }
          if (type === "bobby")
            bobbies++;
        }
      });

    }

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

    addPlayer () {
      this.trailLayer = this.add.layer();
      const playerPosition = this.objectsLayer.objects.find( object => object.name === "player")
      this.player = new Player(this, playerPosition.x, playerPosition.y, this.number);

      this.physics.add.collider(this.player, this.platform, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.objects, this.touchObject, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.monsters, this.playerHitMonster, ()=>{
        return true;
      }, this);
    }

    hitFloor (player, platform) {
    }

    touchObject (player, object) {
        if (object.type === "ending") this.playTracker() 
        if (this.foundBobby && object.type == "tent" && !object.activated) {
          object.activated = true;
          object.touch();
        }

        if (!object.activated && object.type !== "tent") {
          object.activated = true;
          object.touch();
        }
    }

    bobbyIsFound() {
      this.foundBobby = true;
      this.bobby.destroy(); 
      this.bobbySprite = this.add.sprite(this.player.x + 64, this.player.y + 32, "player", 4).setOrigin(0.5);
    }

    playerHitMonster(player, monster) {
      if (!player.dead) {
        this.player.dead = true;
        this.revealEnding();
      }
    }

    loadAudios () {
        this.audios = {
          "mars_background": this.sound.add("mars_background"),
          "step": this.sound.add("step"),
          "kill": this.sound.add("kill"),
          "blip": this.sound.add("blip"),
          "ohmygod": this.sound.add("ohmygod"),
          "manscream": this.sound.add("manscream"),
          "childscream": this.sound.add("childscream"),
          "holeshout": this.sound.add("holeshout"),
          "daddy": this.sound.add("daddy"),
          "mom": this.sound.add("mom"),
          "where": this.sound.add("where"),
          "shock": this.sound.add("shock"),
          "killed": this.sound.add("killed"),          
          "thunder0": this.sound.add("thunder0"),
          "thunder1": this.sound.add("thunder1"),
          "thunder2": this.sound.add("thunder2"),
          "thunder3": this.sound.add("thunder3"),
        };
        this.tracker = this.sound.add("tracker");
      }
    
    playBobby () {
      if (this.foundBobby) return
      const distance =  Phaser.Math.Distance.Between(this.player.x, this.player.y, this.bobby.x, this.bobby.y);
      const volume = 200.0 / distance;

      const audios = ["daddy", "mom", "where"];
      const text = ['"Daddy?"', '"Mom?"', '"Where are you?"'];
      this.audios[audios[this.number]].play({volume});  
      this.time.delayedCall(Phaser.Math.Between(3000, 6000), () => { this.playBobby()}, null, this)

      this.bobbyTalk.setText(text[this.number]);
      this.bobbyTalk.setFontSize((60.0/distance) * 500)
      this.tweens.add({
        targets: this.bobbyTalk,
        alpha: {from: 1, to: 0},
        duration: 3000
      })
    }

    playAudioRandomly(key) {
      const volume = Phaser.Math.Between(0.8, 1);
      const rate = Phaser.Math.Between(0.8, 1);
      this.audios[key].play({volume, rate});
    }

    playTracker () {
      if (!this.tracker.isPlaying) this.tracker.play({volume: 1});
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
        if (this.number < 2) {
          this.sound.add("creepy").play({
            mute: false,
            volume: 0.5,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
          })
        }
      }

    update() {
      if (this.foundBobby) {
        this.bobbySprite.x = this.player.x + 64;
        this.bobbySprite.y = this.player.y + 32;
      }
    }

    skipThis () {
      if (this.number > 3) return;
      this.player.dead = true;
      this.player.body.stop();
      this.theme.stop();
      this.scene.start("transition", { number: this.number + 1});
    }

    revealEnding (scene = "transition") {
      const shouts = ["manscream","ohmygod", "childscream"]
      const ohmy = this.sound.add(shouts[this.number])
      ohmy.play();
      this.cameras.main.shake(3000)

      //this.showExit(this.description)
      this.sound.add("monster").play({volume: 1.5, rate: 0.8})
      const monster = this.add.sprite(this.player.x + 64, this.player.y + 64, "monster").setOrigin(0.5)
      const fade = this.add.rectangle(this.player.x, this.player.y, 1800, 1800, 0x000000).setOrigin(0.5).setAlpha(0)
      this.tweens.add({
          targets: fade,
          alpha: {from: 0, to: 1},
          duration: 1500,
          ease: 'Sine',
      })
      this.anims.create({
          key: "monster",
          frames: this.anims.generateFrameNumbers("monster", { start: 0, end: 5 }),
          frameRate: 3
        });
        monster.anims.play("monster", true)
      ohmy.on('complete', function () {
          //log("Dale fin")
          this.playAudio("holeshout")
          this.finishScene(scene, false);
      }.bind(this))
  }

    finishScene (scene = "transition", mute = true) {
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
      //this.theme.stop();
      this.time.delayedCall(3000, () => {
        if (this.mute) this.sound.stopAll();
        this.scene.start(scene, {next: "underwater", name: "STAGE", number: this.number + 1});
      }, null, this);
    }

    updatePosition (x, y , z = 0) {
      this.positionText.setText(`Lt: ${x*10} Lg: ${y*10}`);
    }
}
