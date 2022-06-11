import Block from "./block";
import Player from "./player";

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
        this.player = null;
        this.score = 0;
        this.scoreText = null;
    }

    init (data) {
      this.name = data.name;
      this.number = data.number || 0;
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

      //this.loadAudios(); 
      // this.playMusic();
    }

    addMap() {
      this.tileMap = this.make.tilemap({ key: `scene${this.number}` , tileWidth: 32, tileHeight: 32 });
      this.tileSetBg = this.tileMap.addTilesetImage("tileset_fg");
      this.tileMap.createStaticLayer('background', this.tileSetBg)
  
      this.tileSet = this.tileMap.addTilesetImage("tileset_fg");
      this.platform = this.tileMap.createLayer(`scene${this.number}`, this.tileSet);
      this.breakable = this.tileMap.createLayer("breakable", this.tileSet);
      this.objectsLayer = this.tileMap.getObjectLayer('objects');
      this.platform.setCollisionByExclusion([-1]);
      this.breakable.setCollisionByExclusion([-1]);
      this.physics.world.setBounds(0, 0, this.width, this.height);
      this.exits = this.add.group();
      this.blocks = this.add.group();
      this.hearts = this.add.group();
      this.brokenBlocks = this.add.group();
      this.texts = [];
      this.objectsLayer.objects.forEach( object => {
        if (object.name.startsWith("block")){
          this.blocks.add(new Block(this, object.x - 16, object.y - 16))
        }

        if (object.name.startsWith("exit")){
          this.exits.add(new Exit(this, object.x - 16, object.y))
        }

        if (object.name.startsWith("extra_time")){
          this.hearts.add(new ExtraTime(this, object.x, object.y))
        }


        if (object.name === "text") {
          this.texts.push(object);
        }
      })
    }

    addPlayer() {
      const playerPosition = this.objectsLayer.objects.find( object => object.name === "player")
      this.player = new Player(this, playerPosition.x, playerPosition.y);
      this.physics.add.collider(this.player, this.platform, this.hitFloor, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.breakable, this.hitBreakable, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.player, this.brokenBlocks, this.hitBroken, ()=>{
        return true;
      }, this);
    }

    onWorldBounds (body, part) {
      const name = body.gameObject.name;

      if (name === "electron") this.playAudio("bump")
      if (["particle"].includes(name))
        body.gameObject.destroy();
    }

    loadAudios () {
      this.audios = {
        "beam": this.sound.add("beam"),
      };
    }

    playRandom(key) {
      return;
      this.audios[key].play({
        rate: Phaser.Math.Between(1, 1.5),
        detune: Phaser.Math.Between(-1000, 1000),
        delay: 0
      });
    }

    hitFloor(player, block) {
      
    }

    hitBreakable(player, block) {
      if (player.falling) {
        const tile = this.getTile(block)
        console.log("Hit!", tile, block.layer.name, player.jumping, player.falling)
        this.brokenBlocks.add(new Block(this, block.pixelX, block.pixelY, block.layer.name))
        this.breakable.removeTileAt(tile.x, tile.y);
      }

    }

    hitBroken(player, block) {

    }
 
    getTile(platform) {
      const {x, y} = platform;
      return this.breakable.getTileAt(x, y);
    }

    playAudio(key) {
      return;
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
