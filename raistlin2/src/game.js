import Player from "./player";
import { Light, Rune, Line } from "./particle";
import Fireball from "./fireball";
import Skeleton from "./skeleton";

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
      this.pointer = this.input.activePointer;
      this.input.mouse.disableContextMenu();
      this.trailLayer = this.add.layer();

      this.addMana();
      this.loadAudios(); 

      // this.playMusic();
    }


    addMap() {
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
      this.waters = [];

      this.objectsLayer.objects.forEach( object => {
        if (object.name.startsWith("skeleton")) {
          let skeleton = new Skeleton(this, object.x, object.y, object.name);
          this.skeletons.add(skeleton)
          this.foesGroup.add(skeleton)
        }
      });

      this.backgroundLayer.forEachTile( (tile) => {
        if (this.isWater(tile)) {
          console.log(tile)
          this.waters.push(tile);
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
      this.manaText = this.add.bitmapText(this.center_width - 150, this.height - 10,  "mainFont", "MANA: ", 15).setTint(0xffffff).setOrigin(0.5);
      this.manaBar = this.add.rectangle(this.center_width, this.height - 20, this.mana * 2, 20, 0xffffff).setOrigin(0.5);
    }

    hitFloor(player, layer) {

    }

    hitBackground(player, tile) {
      console.log("Plyaer, hit", tile)
      if (this.isWaterDeath(tile)) {
        console.log("Water hit!", tile)
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
      arrow.destroy();
    }

    arrowHitPlatform(arrow, platform) {
      arrow.destroy();
    }

    fireballHitLine (fireball, line) {

    }

    fireballHitPlatform(fireball, platform) {
      // Add sound
    }

    fireballHitFoe(fireball, foe) {
      //fireball.destroy();
      foe.destroy();
    }

      loadAudios () {
        this.audios = {
          "cast": this.sound.add("cast"),
          "emptymana": this.sound.add("emptymana"),
          "fireball": this.sound.add("fireball"),
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

    update(time, delta) {
      this.shootTime += delta;
      this.hidePointer()
      if (this.pointer.isDown) {
        if (this.pointer.rightButtonDown()) {
          console.log("SHOOT")
          this.useMana(this.shoot.bind(this));
        } else {
          console.log("PAINT")
          this.useMana(this.paintLine.bind(this));
        }

      }
      this.updateWater();
    }

    updateWater() {
      const waterTiles = [10, 11, 12];
      const tile = Phaser.Math.RND.pick(this.waters)
      const nextTile = tile.index < 12 ? tile.index + 1 : 10;
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
          this.time.delayedCall(1000, () => this.restartScene(), null, this);
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

    hidePointer() {
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
      this.theme.stop();
      this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1});
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }
}
