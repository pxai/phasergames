import Player from "./player";
import { Light, Rune, Line, Smoke } from "./particle";
import Fireball from "./fireball";
import Skeleton from "./skeleton";
import Exit from "./exit";
import Key from "./key";
import Turn from "./turn";

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
      this.initialMana = data.mana || 100;
  }

    preload () {
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
      this.addHelp();
      this.loadAudios();
      this.showTexts();
      this.playMusic();
    }

    addPointer() {
      this.hiddenPointer = false;
      this.pointer = this.input.activePointer;
      this.input.mouse.disableContextMenu();
    }
  
    addMap() {
      this.waterTime = 0;
      this.tileMap = this.make.tilemap({ key: `scene${this.number}` , tileWidth: 25, tileHeight: 25 });

      this.tileSetBg = this.tileMap.addTilesetImage("ninjagolf");
      this.backgroundLayer = this.tileMap.createLayer('background', this.tileSetBg)
 
      this.tileSet = this.tileMap.addTilesetImage("ninjagolf");
      this.platform = this.tileMap.createLayer(`scene${this.number}`, this.tileSet);
      this.objectsLayer = this.tileMap.getObjectLayer('objects');

      this.tileSetItems = this.tileMap.addTilesetImage("tiles");
      this.tileMap.createLayer('items', this.tileSetItems)
  
      this.platform.setCollisionByExclusion([-1]);

      this.foesGroup = this.add.group();
      this.skeletons = this.add.group();
      this.fireballs = this.add.group();
      this.exits = this.add.group();
      this.keys = this.add.group();
      this.turnGroup = this.add.group();
      this.texts = [];
      this.waters = [];
      this.watersDeath = [];
      this.door = [];

      this.objectsLayer.objects.forEach( object => {
        if (object.name.startsWith("skeleton")) {
          console.log("Skel: ", object.type)
          let skeleton = new Skeleton(this, object.x, object.y, object.type || "0");
          this.skeletons.add(skeleton)
          this.foesGroup.add(skeleton)
        }

        if (object.name.startsWith("exit")) {
          this.exits.add(new Exit(this, object.x, object.y, object.name));
        }

        if (object.name === "key") {
          this.keys.add(new Key(this, object.x, object.y));
        }

        if (object.name === "turn") {
          this.turnGroup.add(new Turn(this, object.x, object.y))
        }

        if (object.name === "text") {
          this.texts.push(object);
        }
      });

      this.backgroundLayer.forEachTile( (tile) => {
        if (this.isWater(tile)) {
          this.waters.push(tile);
        }

        if (this.isWaterDeath(tile)) {
          this.watersDeath.push(tile);
        }


        if (this.isDoor(tile)) {
          this.door.push(tile)
        }

      });
    }

    showTexts() {
       this.texts.forEach(text => {
        let help = this.add.bitmapText(text.x, text.y, "arcade", text.type, 20).setOrigin(0.5).setTint(0xffffff).setDropShadow(1, 2, 0x204631, 0.7);
        this.tweens.add({
          targets: help,
          duration: 10000,
          alpha: { from: 1, to: 0},
          ease: 'Linear'
        })
      })
    }

    isDoor (tile) {
      return tile?.properties['element']?.toString().startsWith("door")
    }

    isWater (tile) {
      return tile?.properties['element'] === "water"
    }

    isWaterDeath (tile) {
      return tile?.properties['element'] === "waterdeath"
    }

    addPlayer () {
      this.shootTime = 0;
      this.lineTime = 0;
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

      this.physics.add.collider(this.foesGroup, this.platform, this.turnFoe, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.fireballs, this.exits, this.fireballHitExit, ()=>{
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
      
      this.physics.add.collider(this.skeletons, this.turnGroup, this.turnFoe, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.fireballs, this.foesGroup, this.fireballHitFoe, ()=>{
        return true;
      }, this);
    }


    turnFoe (foe, platform) {
      foe.turn();
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

    fireballHitLine (fireball, line) {
      this.playAudio("bump1");
    }

    fireballHitPlatform(fireball, platform) {
      fireball.destroy();
      this.playAudio("bump1");
      Array(Phaser.Math.Between(1,3)).fill(0).forEach( i => new Smoke(this, fireball.x, fireball.y))
    }

    fireballHitFoe(fireball, foe) {
      this.playAudio("bump1");
      //fireball.destroy();
      //this.playAudio("boom");
      Array(Phaser.Math.Between(1,5)).fill(0).forEach( i => new Smoke(this, foe.x+i, foe.y+i, null, null, 0x95b8c7))

      //foe.destroy();
    }

    fireballHitExit(player, exit) {
      if (exit.name.startsWith("exit")) {
        this.finishScene();
      }
    }

    playerHitsKey(player, key) {
      key.destroy();
      this.playAudio("key")
      this.playAudio("door");
      player.hasKey = true;

      this.openDoor();
    }

    openDoor () {
      const otherDoor = {'door0': 36, 'door1': 37, 'door2': 38, 'door3': 39}
      this.door.forEach(tile => {
        let index = otherDoor[tile.properties['element']];
        this.backgroundLayer.putTileAt(index, tile.x, tile.y)
        Array(Phaser.Math.Between(1,3)).fill(0).forEach( i => new Smoke(this, tile.pixelX + 10, tile.pixelY + 10))

      })
    }

    showKeyWarning () {
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
          "jump": this.sound.add("jump"),
          "bump1": this.sound.add("bump1"),
          "bump2": this.sound.add("bump2"),
          "foeshot": this.sound.add("foeshot"),
          "death": this.sound.add("death"),
          "win": this.sound.add("win"),
          "door": this.sound.add("door"),
          "shuriken": this.sound.add("shuriken"),
          "ice": this.sound.add("ice"),
          "stone": this.sound.add("stone"),
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
        this.game.sound.stopAll();
        this.theme = this.sound.add(theme);
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 0.5,
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
      this.lineTime += delta;
      this.waterTime += delta;
      this.showPointer(time)
      if (this.pointer.isDown) {
        if (this.pointer.rightButtonDown()) {
          this.shoot();
        } else {
          this.paintLine();
        }

      }

    }


    shoot () {
      if (this.shootTime < 2000) return 0;
      this.player.anims.play("playerspell", true);
        this.playAudio("shuriken")
       const {worldX, worldY}  = this.pointer;
       const point = new Phaser.Geom.Point(worldX, worldY);
       const fireball = new Fireball(this, this.player.x, this.player.y) ;
       this.fireballs.add(fireball)
       const distance = Phaser.Math.Distance.BetweenPoints(this.player, point) / 100;
       new Rune(this, worldX, worldY);
      this.physics.moveTo(fireball, point.x, point.y, 300);
      this.shootTime = 0;
      return 30;
    }

    showPointer(time) {

      const {worldX, worldY}  = this.pointer;
      const point = new Phaser.Geom.Point(worldX, worldY);
      const distance = Phaser.Math.Distance.BetweenPoints(this.player, point);

      this.input.manager.canvas.style.cursor =  'crosshair';
    }


    paintLine() {
      this.player.anims.play("playerspell", true);
    }

    restartScene () {
      this.theme.stop();
      this.player.finished = true;
      this.scene.start("game", {number: this.number, name: this.name, mana: this.initialMana });
    }

    finishScene () {
      this.theme.stop();
      this.playAudio("win");
      this.player.finished = true;
      if (this.number < 6)
        this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1, mana: this.initialMana});
      else
        this.scene.start("outro");
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }
}
