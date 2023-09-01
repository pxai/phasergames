import Player from "./player";
import Block from "./block";
import Platform from "./platform";
import SeeSaw from "./seesaw";
import Swing from "./swing";
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
      
      this.addMap();
      this.addPlayer();
      this.addCollisions();
      this.addCamera();

      //this.loadAudios(); 
      // this.playMusic();
    }

    addMap() {    
      this.map = this.make.tilemap({ key: "scene0" });
      const tileset = this.map.addTilesetImage("kenney-tileset-64px-extruded");
      const groundLayer = this.map.createLayer("Ground", tileset, 0, 0);
      const lavaLayer = this.map.createLayer("Lava", tileset, 0, 0);

      // Set colliding tiles before converting the layer to Matter bodies
      groundLayer.setCollisionByProperty({ collides: true });
      lavaLayer.setCollisionByProperty({ collides: true });

      // Get the layers registered with Matter. Any colliding tiles will be given a Matter body. We
      // haven't mapped our collision shapes in Tiled so each colliding tile will get a default
      // rectangle body (similar to AP).
      this.matter.world.convertTilemapLayer(groundLayer);
      this.matter.world.convertTilemapLayer(lavaLayer);
  }

  addPlayer() {
      const { x, y } = this.map.findObject("Spawn", obj => obj.name === "Spawn Point");
    this.player = new Player(this, x, y);
  }

  addCollisions () {
    this.unsubscribePlayerCollide = this.matterCollision.addOnCollideStart({
      objectA: this.player.sprite,
      callback: this.onPlayerCollide,
      context: this
    });

    this.map.getObjectLayer("Crates").objects.forEach(crateObject => {
      const { x, y, width, height } = crateObject;

      // Tiled origin for its coordinate system is (0, 1), but we want coordinates relative to an
      // origin of (0.5, 0.5)
      new Block(this, x + width / 2, y - height / 2)
      new Platform(this, x + Phaser.Math.Between(-128, 128), y)
      // this.matter.add.image(x + width / 2, y - height / 2, "block").setBody({ shape: "rectangle", density: 0.001 });
    });

    this.map.getObjectLayer("Platform Locations").objects.forEach(seeSawObject => {
      new SeeSaw(this, seeSawObject.x, seeSawObject.y);
    });

    this.map.getObjectLayer("Swing Locations").objects.forEach(swing => {
      new Swing(this, swing.x, swing.y);
    });
  }

  onPlayerCollide({ gameObjectA, gameObjectB }) {
    console.log("Player collide: ", gameObjectA, gameObjectB)
    if (!gameObjectB) return;
    if (gameObjectB.name === "block") this.playerHitsBlock(gameObjectB);
    if (gameObjectB instanceof Platform) this.playerOnPlatform(gameObjectB);
    if (!(gameObjectB instanceof Phaser.Tilemaps.Tile)) return;

    const tile = gameObjectB;

    // Check the tile property set in Tiled (you could also just check the index if you aren't using
    // Tiled in your game)
    if (tile.properties.isLethal) {
      // Unsubscribe from collision events so that this logic is run only once
      this.unsubscribePlayerCollide();

      //this.player.freeze();
      this.restartScene();
    }
  }

  playerHitsBlock(block) {
    console.log("Hit block!!", block)
  }

  playerOnPlatform(block) {
    console.log("Hit Platform!!", block)
  }

  addCamera() {
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player.sprite, false, 0.5, 0.5);
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

    restartScene() {
      this.cameras.main.fade(250, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => this.scene.restart());
    }

    finishScene () {
      //this.theme.stop();
      this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1});
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }
}
