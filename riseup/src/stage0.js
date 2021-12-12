import Player from "./player";
import Bat from "./bat";
import Snake from "./snake";
import Drop from "./drop";
import Turn from "./turn";
import Dust from "./dust";

export default class Stage0 extends Phaser.Scene {
    constructor () {
        super({ key: "stage0" });
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
      this.addMap();
      this.addPlayer();
      this.addColliders();
      this.showData();
      //this.showDie()
      //this.loadAudios(); 
      // this.playMusic();
    }

    addMap() {
      this.tileMap = this.make.tilemap({ key: "scene0" , tileWidth: 32, tileHeight: 32 });
      this.tileSetBg = this.tileMap.addTilesetImage("riseup_tileset_bg");
      this.tileMap.createStaticLayer('background', this.tileSetBg)
  
      this.tileSet = this.tileMap.addTilesetImage("weezard_tileset_fg");
      this.platform = this.tileMap.createLayer('scene0', this.tileSet);
      this.objectsLayer = this.tileMap.getObjectLayer('objects');
      this.platform.setCollisionByExclusion([-1]);

    }

    addPlayer () {
      this.playerInitialPosition = this.objectsLayer.objects.find( object => object.name === "player")
      this.player = new Player(this, this.playerInitialPosition.x, this.playerInitialPosition.y, "player", +this.registry.get("health"));
    }

    showDieEvent (die = 0) {
      this.die = (this.die === 6 ? 1 : this.die + 1);
      this.dieImage.destroy()
      this.dieImage = this.add.image(this.center_width, this.height - 180, `d${this.die}`).setOrigin(0.5).setScale(2)
    }

    addColliders () {
      this.physics.add.collider(this.player, this.platform, this.hitFloor, ()=>{
        return true;
      }, this);

      this.dice = this.add.group();
      this.physics.add.collider(this.player, this.dice, this.hitDie, ()=>{
        return true;
      }, this);

      this.foesGroup = this.add.group();

      this.turnGroup = this.add.group();
      this.batGroup = this.add.group();
      this.snakeGroup = this.add.group();
      this.dropGroup = this.add.group();
      this.exitGroup = this.add.group();
      this.objectsLayer.objects.forEach( object => {
        if (object.name === "bat") {
          let bat = new Bat(this, object.x, object.y, object.type);
          this.batGroup.add(bat)
          this.foesGroup.add(bat)
        }

        if (object.name === "snake") {
          let snake = new Snake(this, object.x, object.y, object.type);
          this.snakeGroup.add(snake);
          this.foesGroup.add(snake);
        }

        if (object.name === "drop") {
          let drop = new Drop(this, object.x, object.y);
          this.dropGroup.add(drop)
          this.foesGroup.add(drop);
        }

        if (object.name === "turn") {
          this.turnGroup.add(new Turn(this, object.x, object.y))
        }

        if (object.name === "exit") {
          this.exitGroup.add(new Turn(this, object.x, object.y, object.width, object.height, object.type))
        }
      });

      this.shots = this.add.group();

      this.physics.add.collider(this.player, this.batGroup, this.hitPlayer, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.snakeGroup, this.hitPlayer, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.dropGroup, this.hitPlayer, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.exitGroup, this.touchExit, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.batGroup, this.platform, this.turnFoe, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.snakeGroup, this.turnGroup, this.turnFoe, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.snakeGroup, this.platform, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.dropGroup, this.platform, this.dropHitFloor.bind(this), ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.foesGroup, this.shots, this.foeHitShot, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.foesGroup, this.dice, this.foeHitDie, ()=>{
        return true;
      }, this);
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
    
      hitFloor(player, floor) {

      }

      touchExit(player, exit) {

        this.finishScene(exit.type)
      }

      dropHitFloor(drop, floor) {
        drop.death();

        this.time.delayedCall(1000, this.regenerateDrop, [drop], this);
      }

      regenerateDrop(drop) {
        this.dropGroup.add(new Drop(this, drop.initialX, drop.initialY))
      }

      hitDie(player, die) {
        player.hitDie(die);
      }

      hitPlayer (player, foe) {
        console.log("HIT PLAYER: ", player, foe)
        if (foe.name !== "drop") foe.turn();
        new Dust(player.scene, player.x, player.y, "0xff0000");
        player.hit();
        this.updateHealth(player.health)
        this.time.delayedCall(1000, () => this.respawnPlayer(), null, this);
      }

      foeHitDie(foe, die) {
        foe.turn();
        new Dust(foe.scene, die.x, die.y)
        die.destroy();
      }

      turnFoe (foe, platform) {
        foe.turn();
      }

      foeHitShot (foe, shot) {
        console.log("HIT FOE ", shot, foe)
        foe.destroy();
        shot.destroy();
      }

    update() {
      this.player.update();
    }

    finishScene (next) {
      //this.theme.stop();
      this.scene.start(next, {next: next, name: "STAGE", number: this.number + 1, time: this.time * 2});
    }

    respawnPlayer() {
      this.player.x = this.playerInitialPosition.x;
      this.player.y = this.playerInitialPosition.y;
      /*this.tweens.add({
        targets: this.player,
        duration: 1000,
        alpha: {from: 0.5, to: 1},
        repeat: 20,
    }) */
    this.player.body.enable = true;
    }

    gameOver () {
      //this.theme.stop();
      this.scene.start("outro", {next: "", name: "STAGE", number: this.number + 1, time: this.time * 2});
    }

    showData () {
      this.dieImage = this.add.image(this.center_width, this.height - 180, "d1").setOrigin(0.5).setScale(2)
      this.die = 1;
      this.timer = this.time.addEvent({ delay: 1000, callback: this.showDieEvent, callbackScope: this, loop: true });

      this.hearts = this.add.image(20, this.height - 125, "heart")
      this.heartsText = this.add.bitmapText(60, this.height - 100, "wizardFont", this.player.health, 22).setOrigin(0.5)
      this.room = this.add.bitmapText(this.width - 200, this.height - 100, "wizardFont", "Room: " + this.registry.get("room"), 22).setOrigin(0.5)
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }

    updateHealth (value) {
      this.registry.set("health", value);
      this.heartsText.setText(Number(value).toLocaleString());
  }
}
