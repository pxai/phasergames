import Player from "./player";
import { Light, Rune, Line, Smoke } from "./particle";
import Fireball from "./fireball";
import Skeleton from "./skeleton";
import Exit from "./exit";
import Key from "./key";

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }

    init (data) {
      console.log("Data: ", data)
      this.name = data.name;
      this.number = data.number;
      this.initialMana = data.mana;
  }

    preload () {
      console.log("Added game", this.number)
    }

    create () {
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      this.gameOver = false;
      this.cameras.main.setBackgroundColor(0x000000);
      this.lines = this.add.group();
      this.addMap();
      this.addPlayer();

      this.addPointer();
      this.trailLayer = this.add.layer();

      this.addMana();
      this.addHelp();
      this.loadAudios(); 

      // this.playMusic();
    }

    addPointer() {
      this.pointer = this.input.activePointer;
      this.input.mouse.disableContextMenu();
    }
  
    addMap() {
      this.waterTime = 0;
      this.tileMap = this.make.tilemap({ key: `scene${this.number}` , tileWidth: 25, tileHeight: 25 });

      this.tileSetBg = this.tileMap.addTilesetImage("map");
      this.backgroundLayer = this.tileMap.createLayer('background', this.tileSetBg)
 
      this.tileSet = this.tileMap.addTilesetImage("map");
      this.platform = this.tileMap.createLayer(`scene${this.number}`, this.tileSet);
      this.objectsLayer = this.tileMap.getObjectLayer('objects');

      this.tileSetItems = this.tileMap.addTilesetImage("tiles");
      this.tileMap.createLayer('items', this.tileSetItems)
  
      this.platform.setCollisionByExclusion([-1]);

      this.foesGroup = this.add.group();
      this.skeletons = this.add.group();
      this.fireballs = this.add.group();
      this.arrows = this.add.group();
      this.exits = this.add.group();
      this.keys = this.add.group();
      this.waters = [];
      this.watersDeath = [];

      this.objectsLayer.objects.forEach( object => {
        if (object.name.startsWith("skeleton")) {
          let skeleton = new Skeleton(this, object.x, object.y, object.name, object.type || 0);
          this.skeletons.add(skeleton)
          this.foesGroup.add(skeleton)
        }

        if (object.name.startsWith("exit")) {
          this.exits.add(new Exit(this, object.x, object.y, object.name));
        }

        if (object.name === "key") {
          this.keys.add(new Key(this, object.x, object.y));
        }
      });

      this.backgroundLayer.forEachTile( (tile) => {
        if (this.isWater(tile)) {
          this.waters.push(tile);
        }

        if (this.isWaterDeath(tile)) {
          this.watersDeath.push(tile);
        }

      });
    }


    isWater (tile) {
      return tile?.properties['element'] === "water"
    }

    isWaterDeath (tile) {
      return tile?.properties['element'] === "waterdeath"
    }

    addPlayer () {
      this.shootTime = 0;
      const playerPosition = this.objectsLayer.objects.find( object => object.name === "player")
      this.player = new Player(this, playerPosition.x, playerPosition.y, 0);


      this.physics.add.collider(this.player, this.platform, this.hitFloor, ()=>{
        return true;
      }, this);


      this.physics.add.collider(this.player, this.lines, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.backgroundLayer, this.hitBackground, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.arrows, this.arrowHitPlayer, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.foesGroup, this.foeHitPlayer, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.exits, this.playerHitsExit, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.keys, this.playerHitsKey, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.fireballs, this.platform, this.fireballHitPlatform, ()=>{
        return true;
      }, this);
      
      this.physics.add.collider(this.fireballs, this.lines, this.fireballHitLine, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.arrows, this.platform, this.arrowHitPlatform, ()=>{
        return true;
      }, this);
      
      this.physics.add.collider(this.arrows, this.lines, this.arrowHitLine, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.fireballs, this.foesGroup, this.fireballHitFoe, ()=>{
        return true;
      }, this);
    }

    addMana () {
      this.emptyMana = null;
      this.castSpell = this.sound.add("cast");
      //this.checkManaEvent = this.time.addEvent({ delay: 1000, callback: this.recoverMana, callbackScope: this, loop: true });
      this.mana = this.initialMana;
      this.manaText = this.add.bitmapText(this.center_width - 100, this.height - 50,  "mainFont", "MANA: ", 15).setTint(0xffffff).setOrigin(0.5).setScrollFactor(0);
      this.manaBar = this.add.rectangle(this.center_width + 50, this.height - 62, this.mana * 2, 20, 0xffffff).setOrigin(0.5).setScrollFactor(0);
    }

    addHelp () {
      this.helpText = this.add.bitmapText(this.center_width, this.height - 50,  "mainFont", "Show Help", 15).setTint(0xffffff).setOrigin(0.5).setScrollFactor(0).setAlpha(0);
     }

     showHelp(message) {
      this.helpText.setText(message);
      this.tweens.add({
        targets: this.helpText,
        duration: 10000,
        alpha: {from: 1, to: 0},
      })
     }

    hitFloor(player, layer) {

    }

    hitBackground(player, tile) {
      if (this.isWaterDeath(tile)) {
        player.die();
      }
    }

    foeHitPlayer(player, foe) {
      player.die();
    }

    arrowHitPlayer(player, arrow) {
      arrow.destroy();
      player.die();
    }

    arrowHitLine (arrow, line) {
     this.arrowHitPlatform(arrow, line)
    }

    arrowHitPlatform(arrow, platform) {
      Array(Phaser.Math.Between(1,3)).fill(0).forEach( i => new Smoke(this, arrow.x, arrow.y, null, null, 0x95b8c7))
      arrow.destroy();
    }

    fireballHitLine (fireball, line) {

    }

    fireballHitPlatform(fireball, platform) {
      Array(Phaser.Math.Between(1,3)).fill(0).forEach( i => new Smoke(this, fireball.x, fireball.y))
    }

    fireballHitFoe(fireball, foe) {
      //fireball.destroy();
      this.playAudio("boom");
      Array(Phaser.Math.Between(1,5)).fill(0).forEach( i => new Smoke(this, foe.x+i, foe.y+i, null, null, 0x95b8c7))

      foe.destroy();
    }

    playerHitsExit(player, exit) {
      if (exit.name === "exit1") {
        if (player.hasKey) {
          this.finishScene();
        } else {
          this.showHelp("You need the key!!")
        }
      }

      if (exit.name === "exit0") {
        this.finishScene();
      }
    }

    playerHitsKey(player, key) {
      key.destroy();
      this.playAudio("key")
      player.hasKey = true;
    }

    showKeyWarning () {
      console.log("You need the key")
    }

      loadAudios () {
        this.audios = {
          "cast": this.sound.add("cast"),
          "emptymana": this.sound.add("emptymana"),
          "fireball": this.sound.add("fireball"),
          "key": this.sound.add("key"),
          "land": this.sound.add("land"),
          "boom": this.sound.add("boom"),
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

    update(time, delta) {
      if (time < 5000) return;
      this.shootTime += delta;
      this.waterTime += delta;
      this.hidePointer(time)
      if (this.pointer.isDown) {
        if (this.pointer.rightButtonDown()) {
          console.log("SHOOT")
          this.useMana(this.shoot.bind(this));
        } else {
          console.log("PAINT", time)
          this.useMana(this.paintLine.bind(this));
        }

      }

     // this.updateWater();
      this.updateWaterDeath();
    }

    updateWater() {
      if (this.waterTime > 1000) {
        const waterTiles = [10, 11, 12];
        this.waters.forEach(tile => {
          const nextTile = tile.index < 12 ? tile.index + 1 : 10;
         // this.backgroundLayer.putTileAt(nextTile, tile.x, tile.y)
        });
        this.waterTime = 0;
      }
    }

    updateWaterDeath() {
      const waterTiles = [13, 14, 15, 16];
      const tile = Phaser.Math.RND.pick(this.watersDeath)
      const nextTile = tile.index < 16 ? tile.index + 1 : 13;
      this.backgroundLayer.putTileAt(nextTile, tile.x, tile.y)        
    }

    useMana (spell) {
      if (this.mana > 0) {
        if (!this.castSpell.isPlaying) {
          this.castSpell.play();
        }
        const cost = spell();
        this.mana -= cost;
        console.log("Cost: ", cost, " New mana: ", this.mana)
        this.updateMana()
      } else {
        if (!this.emptyMana) {
          this.gameOver = true;
          this.emptyMana = this.sound.add("emptymana");
          this.emptyMana.play();
          this.player.die();
         }
        
        this.tweens.add({
          targets: [this.manaText],
          duration: 200,
          alpha: { from: 0.4, to: 1},
          repeat: 10
        });
      }
    }

    shoot () {
      if (this.shootTime < 100) return 0;
       const {worldX, worldY}  = this.pointer;
       const point = new Phaser.Geom.Point(worldX, worldY);
       const fireball = new Fireball(this, this.player.x, this.player.y) ;
       this.fireballs.add(fireball)
       const distance = Phaser.Math.Distance.BetweenPoints(this.player, point) / 100;
       new Rune(this, worldX, worldY);
      console.log(worldX, worldY)
      this.physics.moveTo(fireball, point.x, point.y, 300);
      this.shootTime = 0;
      return 10;
    }

    hidePointer(time) {

      const {worldX, worldY}  = this.pointer;
      const point = new Phaser.Geom.Point(worldX, worldY);
      const distance = Phaser.Math.Distance.BetweenPoints(this.player, point);

      this.input.manager.canvas.style.cursor = (distance > 250) ? 'none' : 'crosshair';

    }

    updateMana () {
      this.manaBar.width = this.mana * 2;
    }

    paintLine() {
      this.lines.add(new Line(this, this.pointer.x-1, this.pointer.y, 12, 12, 0xffffff));
      this.lines.add(new Line(this, this.pointer.x, this.pointer.y, 12, 12, 0xffffff));
      this.lines.add(new Line(this, this.pointer.x+1, this.pointer.y,  12, 12, 0xffffff));

      return 1;
    }

    restartScene () {
     // this.theme.stop();
     this.player.finished = true;
      this.scene.start("game", {number: this.number, name: this.name, mana: this.initialMana });
    }

    finishScene () {
   //   this.theme.stop();
      this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1});
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }
}
