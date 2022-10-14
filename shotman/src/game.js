import Player from "./player";
import Shell from "./shell";

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }

    init (data) {
      this.name = data.name;
      this.number = 0 //data.number;
  }

    preload () {
    }

    create () {
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      this.createMap();
      this.addPlayer();

      //this.loadAudios(); 
      // this.playMusic();
    }


    createMap() {
      this.tileMap = this.make.tilemap({ key: "scene" + this.number , tileWidth: 64, tileHeight: 64 });
      this.tileSetBg = this.tileMap.addTilesetImage("background");
      this.tileMap.createStaticLayer('background', this.tileSetBg)
  
      this.tileSet = this.tileMap.addTilesetImage("cave");
      this.platform = this.tileMap.createLayer('scene' + this.number, this.tileSet);
      this.objectsLayer = this.tileMap.getObjectLayer('objects');

      this.platform.setCollisionByExclusion([-1]);
      this.shells = this.add.group();
      this.foes = this.add.group();
      this.fireballs = this.add.group();
      this.shots = this.add.group();
      this.blasts = this.add.group();
      this.tnts = this.add.group();

      this.objectsLayer.objects.forEach( object => {
        if (object.name.startsWith("shell")) {
          this.shells.add(new Shell(this, object.x - 16, object.y - 16));
        }
      });
    }

    addPlayer () {
      this.trailLayer = this.add.layer();
      const playerPosition = this.objectsLayer.objects.find( object => object.name === "player")
      this.player = new Player(this, playerPosition.x, playerPosition.y);

      this.physics.add.collider(this.player, this.platform, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.tnts, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.foes, this.tnts, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.foes, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.shells, this.playerPickShell, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.fireballs, this.playerHitByFireball, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.foes, this.playerHitByFoe, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.shots, this.foes, this.foeHitByShot, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.blasts, this.foes, this.foeHitByBlast, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.shots, this.tnts, this.tntHitByShot, ()=>{
        return true;
      }, this);
    }

    hitFloor (player, platform) {

    }

    playerPickShell (player, shell) {
      player.shells++;
      shell.destroy();
    }

    playerHitByFireball (player, fireball) {

    }

    playerHitByFoe (player, foe) {

    } 

    foeHitByShot (shot, foe) {
      shot.destroy();
    }

    foeHitByBlast (blast, foe) {

    }

    tntHitByShot (shot, tnt) {
      shot.destroy();
      tnt.destroy();
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

    }

    finishScene () {
      this.sky.stop();
      this.theme.stop();
      this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1});
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }
}
