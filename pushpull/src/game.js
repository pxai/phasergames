
import BlockGroup from "./block_group";
import Exit from "./exit";
import { WaterSplash } from "./particle";
import ExtraTime from "./extra_time";

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
      this.input.mouse.disableContextMenu();
      this.addPointer();

      this.addMap();
      //this.setListeners();  
      this.addTimer();
      this.addRetry();

      this.loadAudios(); 
      this.showTexts();
      this.solved = false;
    }

    addRetry () {
      this.R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    addTimer() {
      this.timerText = this.add.bitmapText(this.center_width, 32, "mario", this.limitedTime, 30).setOrigin(0.5).setTint(0xffe066).setDropShadow(3, 4, 0x75b947, 0.7);
      this.totalTime = this.limitedTime;
      this.timer = this.time.addEvent({ delay: 1000, callback: this.subSecond, callbackScope: this, loop: true });

    }

    subSecond () {
      this.totalTime--;
      this.updateTimer()

      if (this.totalTime <= 0) { 
        this.timer.destroy();
        if (this.number > 2)
         this.failScene() 
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
      this.hearts = this.add.group();
      this.texts = [];
      this.objectsLayer.objects.forEach( object => {
        if (object.name.startsWith("block")){
          const [name, width, height] = object.name.split("_");
          this.activeBlock = new BlockGroup(this, object.x, object.y, width, height);
          this.blocks.add(this.activeBlock)
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

    showTexts() {
      this.texts.forEach(text => {
       let help = this.add.bitmapText(text.x, text.y, "mario", text.type, 15).setOrigin(0.5).setTint(0xffe066).setDropShadow(1, 2, 0xbf2522, 0.7);
       this.tweens.add({
         targets: help,
         duration: 20000,
         alpha: { from: 1, to: 0},
         ease: 'Linear'
       })
     })
   }

    setListeners () {
      this.activeBlock = null;
      this.blocks.setInteractive();
      this.blocks.on("pointerdown", (pointer) => {
        console.log("pointer")
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

      this.physics.add.overlap(this.player, this.hearts, this.hitExtraTime, ()=>{
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

      if (block.allowChangeDirection)
        player.changeDirection(x, y, block)
      //else player.reverseDirection()
    }

    hitExtraTime(player, heart) {
      heart.destroy();
      this.totalTime = this.totalTime + 10;
      this.updateTimer()
      Array(Phaser.Math.Between(3, 6)).fill().forEach( p => this.trailLayer.add(new WaterSplash(this, player.x, player.y)));
      this.playRandom("coin")
    }

    hitBlockBlock(block, platform) {
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

      loadAudios () {
        this.audios = {
          "platform": this.sound.add("platform"),
          "block": this.sound.add("block"),
          "change": this.sound.add("change"),
          "fail": this.sound.add("fail"),
          "win": this.sound.add("win"),
          "coin": this.sound.add("coin"),
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

    update() {
      if (Phaser.Input.Keyboard.JustDown(this.R)) {
        this.restartScene();
      }
    }

    finishScene () {
      if (this.solved) return;
      this.timer.destroy();
      this.playAudio("win")
      this.solved = true;
      this.winText = this.add.bitmapText(this.center_width, -100, "mario", "STAGE CLEARED!", 30).setOrigin(0.5).setTint(0xffe066).setDropShadow(2, 3, 0x75b947, 0.7);
      this.tweens.add({
        targets: this.winText,
        duration: 500,
        y: {from: this.winText.y, to: this.center_height}
      })
      this.tweens.add({
        targets: this.winText,
        duration: 100,
        scale: {from: 1, to: 1.1},
        repeat: -1,
        yoyo: true
      })
      this.time.delayedCall(2000, () => {
        this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1});
      }, null, this)
    }

    failScene () {
      this.playAudio("fail")
      this.failText = this.add.bitmapText(this.center_width, this.height + 100, "mario", "TIME UP!!", 30).setOrigin(0.5).setTint(0x9A5000).setDropShadow(2, 3, 0x75b947, 0.7);
      this.tweens.add({
        targets: this.failText,
        duration: 500,
        y: {from: this.failText.y, to: this.center_height}
      })
      this.time.delayedCall(2000, () => {
        this.scene.start("game", {next: "underwater", name: "STAGE", number: this.number, limitedTime: 10 + (this.number * 3)  });
      }, null, this)
    }

    restartScene () {
        this.scene.start("game", {next: "underwater", name: "STAGE", number: this.number });
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
