import Player from "./player";
import { Smoke, Debris, Rock, Gold, JumpSmoke } from "./particle";
import { Explosion } from "./steam";
import Chest from "./chest";
import Exit from "./exit";
import places from "./places";
import MapGenerator from "./map_generator";

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
      this.cameras.main.setBackgroundColor(0x000000);

      new MapGenerator(this).createMap();
      this.addPlayer();
      this.addLight();
      this.cameras.main.startFollow(this.player, true, 0.05, 0.05, 0, 100);
      this.loadAudios(); 
      this.playMusic();
      this.addScore()
      this.addHealth();
      this.addTNT();
      this.addTutorial();
      this.addMineName();
      this.playAudio("start");
    }

    addTutorial() {
      if (this.number === 0) {
        this.tutorialText = this.add.bitmapText(175, 400, "western", "Use A-D or Left-Right to move", 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0).setScrollFactor(0);
        const texts = ["Use S or Down to place TNT and avoid it", "Avoid debris!", "Pick gold and chests", "Pick TNTs to add more TNT in a row", "Find the exit, keep going!", ""];
        texts.forEach((text, i) => {
          this.time.delayedCall(4000 * (i + 1), () => { this.tutorialText.setText(texts[i])}, null, this);
        })
      }
    }

    addScore() {
      this.scoreText = this.add.bitmapText(175, 10, "western", "x" +this.registry.get("score"), 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0).setScrollFactor(0)
      this.scoreLogo = this.add.sprite(150, 25, "gold").setScale(1).setOrigin(0.5).setScrollFactor(0)
      const coinAnimation = this.anims.create({
        key: "goldscore",
        frames: this.anims.generateFrameNumbers("gold", { start: 0, end: 7 }, ),
        frameRate: 8,
      });
      this.scoreLogo.play({ key: "goldscore", repeat: -1 });
    }

    addHealth() {
      this.healthText = this.add.bitmapText(375, 10, "western", "x" +this.registry.get("health"), 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0).setScrollFactor(0)
      this.healthLogo = this.add.sprite(350, 25, "heart").setScale(1.2).setOrigin(0.5).setScrollFactor(0)
      this.tweens.add({
        targets: this.healthLogo,
        scale: {from: 1.2, to: 1},
        yoyo: true,
        duration: 500,
        repeat: -1
      })
    }

    addTNT() {
      this.tntText = this.add.bitmapText(575, 10, "western", "x" +this.registry.get("tnt"), 30).setDropShadow(0, 4, 0x222222, 0.9).setOrigin(0).setScrollFactor(0)
      this.tntLogo = this.add.sprite(550, 25, "tnt").setScale(0.8).setOrigin(0.5).setScrollFactor(0)
      const coinAnimation = this.anims.create({
        key: "tntscore",
        frames: this.anims.generateFrameNumbers("tnt", { start: 0, end: 2 }, ),
        frameRate: 8,
      });
      this.tntLogo.play({ key: "tntscore", repeat: -1 });
    }

    addLight() {
      this.lights.enable();
      this.lights.setAmbientColor(0x707070);
      this.playerLight = this.lights.addLight(0, 100, 100).setColor(0xffffff).setIntensity(3.0);
    }

    addMineName () {
      const name = "Entering \"" + Phaser.Math.RND.pick(places) + "\" shafts";
      this.mineName = this.add.bitmapText(this.center_width, 100, "western", name, 40).setTint(0xe5cc18).setDropShadow(3, 4, 0xb85d08, 0.7).setOrigin(0.5).setScrollFactor(0)
      this.tweens.add({
        targets: this.mineName,
        duration: 4000,
        alpha: { from: 1, to: 0},
      })
    }

    addPlayer() {
      this.player100 = 100;
      const { x, y } = {x: 400, y: 400}
      const health = +this.registry.get("health") < 10 ? 10 : +this.registry.get("health");
      this.player = new Player(this, x, y, health, +this.registry.get("tnt"), +this.registry.get("velocity"), +this.registry.get("remote"));


      this.physics.add.collider(this.player, this.layer0, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.layer1, this.hitFloor, ()=>{
        return true;
      }, this);
      this.tnts = this.add.group();

      this.physics.add.collider(this.tnts, this.layer0, this.tntHitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.tnts, this.layer1, this.tntHitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.chests, this.pickChest, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.chests, this.layer0, () => {}, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.chests, this.layer1, () => {}, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.exits, this.layer0, () => {}, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.exits, this.layer1, () => {}, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.golds, this.pickGold, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.exits, this.exitScreen, ()=>{
        return true;
      }, this);

      this.explosions = this.add.group();
      this.chainReaction = this.add.group();
      this.lamps = this.add.group();
      this.rocks = this.add.group();
      this.waves = this.add.group();

      this.physics.add.collider(this.player, this.rocks, this.hitRockPlayer, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.rocks, this.layer0, this.hitRock, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.rocks, this.rocks, this.hitRock, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.rocks, this.layer1, this.hitRock, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.lamps, this.activateLamp, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.explosions, this.hitExplosion, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.chainReaction, this.hitExplosion, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.layer1, this.explosions, this.kaboom, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.rocks, this.explosions, this.rockKaboom, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.layer1, this.waves, this.waveHit, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.layer0, this.waves, this.waveHit, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.tnts, this.explosions, this.tntKaboom, ()=>{
        return true;
      }, this)

      this.physics.add.overlap(this.layer1, this.chainReaction, this.kaboom, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.tnts, this.chainReaction, this.tntKaboom, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.explosions, this.explosions, this.chainKaboom, ()=>{
        return true;
      }, this);
    }

    hitRockPlayer(player, rock) {
      if (!player.flashing && rock.body.touching.down && rock.falling) {
        this.playAudio("hit");
        player.hitSmoke();
        player.hit();
        rock.destroy();
      }
    }

    pickGold (player, gold) {
        gold.destroy()
        this.playAudio("gold");
        let points = Phaser.Math.Between(1, 4);
        this.showPoints(player.x, player.y, "+" + points + " GOLD")
        this.updateScore(points);
    }

    pickChest (player, chest) {
      if (!chest.disabled) {
        this.playAudio("chest1");
        this.playAudio("chest0");
        chest.pick();
      }
    }

    activateLamp(player, lamp) {

    }

    hitExplosion(player, explosion) {
      if (!player.flashing) {
        this.player.hit();
      }
    }

    rockKaboom(rock, explosion) {
      rock.destroy();
    }

    kaboom(explosion, tile) {
      this.cameras.main.shake(Phaser.Math.Between(10, 100));
      if (tile.layer["name"] === "layer1" && [0,1,2,3].includes(tile.index)) {
        Array(Phaser.Math.Between(4,6)).fill(0).forEach( i => new Debris(this, tile.pixelX, tile.pixelY))
        this.layer1.removeTileAt(tile.x, tile.y);
        new Smoke(this, tile.pixelX, tile.pixelY)
        if ([0,1,2,3].includes(tile.index) && Phaser.Math.Between(1, 10) > 9) {
          this.golds.add(new Gold(this, tile.pixelX + 16, tile.pixelY + 16))
        }

      }
    }

    waveHit(wave, tile) {
      if (wave) wave.destroy();
      if (tile.layer["name"] === "layer1") {
        if (Phaser.Math.Between(0, 5) > 4)
          this.rocks.add(new Rock(this, tile.pixelX + (Phaser.Math.Between(-100, 100)), tile.pixelY + 32))
          this.playAudio("stone")
      }
    }

    tntKaboom(tnt, explosion) {
      if (!tnt.chain) {
        tnt.chain = true;
        tnt.kaboom();
      }
    }

    chainKaboom(explosion1, explosion2) {
      this.cameras.main.shake(Phaser.Math.Between(300, 500));
      if (!explosion1.chain && !explosion2.chain) {
        explosion1.chain = true;
        const width = explosion1.width + explosion2.width;
        const height = explosion1.height + explosion2.height;
        this.chainReaction.add(new Explosion(this, explosion1.x, explosion1.y, width, height))
        this.playRandom("explosion")
      }
    }

    exitScreen(player, exit) {
      player.finished = true;
      player.visible = false;
      this.playAudio("exit");
      this.finishScene();
    }

    isBreakable (tile) {
      return tile?.properties['element'] === "break"
    }

    tntHitFloor(tnt, platform) {
    }

    hitRock(rock, layer) {
      if (rock.falling) {
        rock.falling = false;
        this.groundSmoke(rock, 20);
      }
    } 

    groundSmoke (element, offsetY = 10, varX) {
      Array(Phaser.Math.Between(3, 6)).fill(0).forEach(i => {
          const offset = varX || Phaser.Math.Between(-1, 1) > 0 ? 1 : -1;
          varX = varX || Phaser.Math.Between(0, 20);
          new JumpSmoke(this, element.x + (offset * varX), element.y + offsetY)
      })
  }

    hitFloor(player, tile) {
    }

    getTile(platform) {
      const {x, y} = platform;
      return this.layer1.getTileAt(x, y);
    }

      loadAudios () {
        this.audios = {
          "stone": this.sound.add("stone"),
          "explosion": this.sound.add("explosion"),
          "wick": this.sound.add("wick"),
          "land": this.sound.add("land"),
          "jump": this.sound.add("jump"),
          "hit": this.sound.add("hit"),
          "yee-haw": this.sound.add("yee-haw"),
          "chest0": this.sound.add("chest0"),
          "chest1": this.sound.add("chest1"),
          "gold": this.sound.add("gold"),
          "coin": this.sound.add("coin"),
          "start": this.sound.add("start"),
          "exit": this.sound.add("exit"),
          "step": this.sound.add("step"),
        };
      }

      playAudio(key) {
        this.audios[key].play();
      }

      playRandom(key, volume = 1) {
        this.audios[key].play({
          rate: Phaser.Math.Between(1, 1.5),
          detune: Phaser.Math.Between(-1000, 1000),
          delay: 0,
          volume
        });
      }

      playMusic (theme="music") {
        this.theme = this.sound.add("music"+ Phaser.Math.Between(0, 3));
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 0.1,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
      })
      }

    update() {

    }

    finishScene (screen = "game") {
      this.theme.stop();

      this.time.delayedCall(500, () => {
        this.scene.start(screen, {name: "", number: this.number + 1});
      }, null, this)
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        if (score >= this.player100) {
          this.playAudio("start")
          this.playAudio("chest1")
          this.updateHealth(10)
          this.player100 += 100;
        }
        this.playAudio("coin")
        this.scoreText.setText("x"+Number(score).toLocaleString());
        this.tweens.add({
          targets: [this.scoreText, this.scoreLogo],
          scale: { from: 1.4, to: 1},
          duration: 100,
          repeat: 5
        })
    }

    updateHealth (points) {
      const score = +this.registry.get("health") + points;
      this.registry.set("health", score);
      this.healthText.setText("x"+Number(score).toLocaleString());
      this.tweens.add({
        targets: [this.healthText, this.healthLogo],
        scale: { from: 1.4, to: 1},
        duration: 100,
        repeat: 5
      })
    }

    updateTNT (points) {
      const score = +this.registry.get("tnt") + points;
      this.registry.set("tnt", score);
      this.tntText.setText("x"+Number(score).toLocaleString());
      this.tweens.add({
        targets: [this.tntText, this.tntLogo],
        scale: { from: 1.4, to: 1},
        duration: 100,
        repeat: 5
      })
    }

    get midPoint () {
      return{ x: this.cameras.main.worldView.x + this.cameras.main.width / 2,
              y: this.cameras.main.worldView.y + this.cameras.main.height / 2
      };
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
}
