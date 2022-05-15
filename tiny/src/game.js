import Player from "./player";
import Block from "./block";
import Exit from "./exit";
import { WaterSplash } from "./particle";

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
      this.loadAudios(); 
      this.playMusic();
    }

    addTimer() {
      this.timerText = this.add.bitmapText(this.center_width, 32, "mario", this.limitedTime, 30).setTint(0xffe066).setOrigin(0);
      this.totalTime = this.limitedTime;
      this.timer = this.time.addEvent({ delay: 1000, callback: this.subSecond, callbackScope: this, loop: true });

    }

    subSecond () {
      this.totalTime--;
      this.updateTimer()
      console.log("remove it", this.totalTime)
      if (this.totalTime <= 0) { 
        this.timer.destroy();
        //this.restartScene() 
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
      this.physics.world.setBounds(0, 0, this.width, this.height);
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

      this.playRandom("platform")
      Array(Phaser.Math.Between(2, 4)).fill().forEach( p => this.trailLayer.add(new WaterSplash(this, player.x, player.y)));
      player.directionChanged()
    }

    hitBlock(player, block) {
      const {x, y} = block.getDirection();
      this.playRandom("block")
      Array(Phaser.Math.Between(3, 6)).fill().forEach( p => this.trailLayer.add(new WaterSplash(this, player.x, player.y)));

      player.changeDirection(x, y, block)
    }

    hitBlockBlock(block, platform) {
      console.log("Block hit! ", block)
      this.hitPlatform(player, block)
    }


    hitExit(player, exit) {
      exit.destroy();
      player.finish();

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
          "platform": this.sound.add("platform"),
          "block": this.sound.add("block"),
          "change": this.sound.add("change"),
          "fail": this.sound.add("fail"),
          "win": this.sound.add("win"),
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
        this.theme = this.sound.add(theme);
        this.bgSound = this.sound.add("pond");
        this.theme.stop();
        this.theme.play({
          mute: false,
          volume: 0.6,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: true,
          delay: 0
        })

        this.bgSound.play({
          mute: false,
          volume: 0.6,
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
      this.playAudio("win")
      this.time.delayedCall(2000, () => {
        this.theme.stop();
        this.bgSound.stop();
        this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1});
      }, null, this)
    }

    restartScene () {
      this.playAudio("fail")
      this.time.delayedCall(2000, () => {
        this.theme.stop();
        this.bgSound.stop();
        this.scene.start("game", {next: "underwater", name: "STAGE", number: this.number });
      }, null, this)
    }

    updateTimer () {
      if (this.totalTime < 5) {
        this.timerText.setText(this.totalTime).setTint(0xff0000);
        this.tweens.add({
          targets: [this.timerText],
          duration: 200,
          alpha: {from: 0.6, to: 1},
          repeat: -1
        })
      } else {
        this.timerText.setText(this.totalTime);
      }

    }
}
