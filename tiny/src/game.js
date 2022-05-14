import Player from "./player";
import Block from "./block";
import Exit from "./exit";

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
      this.limitedTime = data.limitedTime || 10;
    }

    preload () {
    }

    create () {
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      this.cameras.main.setBackgroundColor(0x000000)
      console.log("Amos")
      this.addPointer();

      //this.addMusic();
      this.addMap();
      this.addPlayer();
      this.setListeners();  
      this.addTimer()    
     // new Scenario(this)
      //this.loadAudios(); 
      // this.playMusic();
    }

    addTimer() {
      this.totalTime = this.limitedTime;
      this.timer = this.time.addEvent({ delay: 1000, callback: this.subSecond, callbackScope: this, loop: true });

    }

    subSecond () {
      this.totalTime--;
      console.log("remove it", this.totalTime)
      if (this.totalTime <= 0) { 
        this.timer.destroy();
        this.restartScene() 
      }

    }

    addMap() {
      this.tileMap = this.make.tilemap({ key: `scene${this.number}` , tileWidth: 32, tileHeight: 32 });
      this.tileSetBg = this.tileMap.addTilesetImage("tileset_fg");
      this.tileMap.createStaticLayer('background', this.tileSetBg)
  
      this.tileSet = this.tileMap.addTilesetImage("tileset_fg");
      this.platform = this.tileMap.createLayer(`scene${this.number}`, this.tileSet);
      this.objectsLayer = this.tileMap.getObjectLayer('objects');
      this.platform.setCollisionByExclusion([-1]);

      this.exits = this.add.group();
      this.blocks = this.add.group();
      this.objectsLayer.objects.forEach( object => {
        if (object.name.startsWith("block")){
          this.blocks.add(new Block(this, object.x - 16, object.y - 16))
        }

        if (object.name.startsWith("exit")){
          this.exits.add(new Exit(this, object.x - 16, object.y))
        }
      })
    }

    setListeners () {
      this.activeBlock = null;
      this.platform.setInteractive();
      this.platform.on("pointerdown", (pointer) => {
        if (this.activeBlock)
          this.activeBlock.deactivate()
      });
    }

    addPlayer() {
      this.trailLayer = this.add.layer();
      const playerPosition = this.objectsLayer.objects.find( object => object.name === "player")
      this.player = new Player(this, playerPosition.x, playerPosition.y)

      this.physics.add.collider(this.player, this.platform, this.hitPlatform, ()=>{
        return true;
      }, this);


      this.physics.add.overlap(this.player, this.blocks, this.hitBlock, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.blocks, this.blocks, this.hitBlockBlock, ()=>{
        return true;
      }, this);

      this.physics.add.collider(this.blocks, this.platform, this.hitBlockBlock, ()=>{
        return true;
      }, this);

      this.physics.add.overlap(this.player, this.exits, this.hitExit, ()=>{
        return true;
      }, this);
    }

    hitPlatform(player, platform) {

    }

    hitBlock(player, block) {
      const {x, y} = block.getDirection();
      player.changeDirection(x, y, block)
    }

    hitBlockBlock(player, block) {
      this.hitPlatform(player, block)
    }


    hitExit(player, exit) {
      exit.destroy();
      this.finishScene();
    }

    addPointer() {
      this.pointer = this.input.activePointer;
      this.input.mouse.disableContextMenu();
    }

    addMusic () {

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
      //this.theme.stop();
      this.time.delayedCall(2000, () => {
        this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1});
      }, null, this)
    }

    restartScene () {
      //this.theme.stop();
      this.time.delayedCall(2000, () => {
        this.scene.start("game", {next: "underwater", name: "STAGE", number: this.number });
      }, null, this)
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }
}
