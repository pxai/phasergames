
import Switch from "./switch";
import Exit from "./exit";
import { WaterSplash } from "./particle";
import Bulb from "./bulb";
import Energy from "./energy";

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
      this.input.mouse.disableContextMenu();
      this.addPointer();
      this.addLight();
      this.add.tileSprite(0, 0, 608, 608, "background").setOrigin(0);
      this.addMap();
      //this.setListeners();  
      this.addMoves();
      this.addRetry();

      this.loadAudios(); 
      this.showTexts();
      this.solved = false;
      this.playAudio("prewin");
      this.playMusic();
    }

    addRetry () {
      this.R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    addMoves() {
      this.movesText = this.add.bitmapText(this.center_width, 32, "mario", "0", 30).setOrigin(0.5).setTint(0xb95e00).setDropShadow(3, 4, 0xfffd00, 0.7);
      this.totalMoves = 0;
    }

    addMap() {
      this.tileMap = this.make.tilemap({ key: `scene${this.number}` , tileWidth: 32, tileHeight: 32 });
      this.tileSetBg = this.tileMap.addTilesetImage("tileset_fg");
      //this.tileMap.createStaticLayer('background', this.tileSetBg)
  
      this.tileSet = this.tileMap.addTilesetImage("tileset_fg");
      this.platform = this.tileMap.createLayer(`scene${this.number}`, this.tileSet)//.setPipeline('Light2D');
      this.objectsLayer = this.tileMap.getObjectLayer('objects');
      this.platform.setCollisionByExclusion([-1]);
      this.physics.world.setBounds(0, 0, this.width, this.height);
      this.exits = this.add.group();
      this.blocks = this.add.group();
      this.switches = this.add.group();
      this.bulbs = this.add.group();
      this.switchLayer = this.add.layer();
      this.energyLayer = this.add.layer();
      this.energy = null;
      this.texts = [];
      this.initialBlocks = this.savePositions();
      this.updateGrid();

      this.objectsLayer.objects.forEach( object => {
        if (object.name.startsWith("switch")){
          const [name, off] = object.name.split("_");
          let switchy = new Switch(this, object.x, object.y, name, off)
          this.switches.add(switchy)
          this.switchLayer.add(switchy)
        }
  
        if (object.name.startsWith("bulb")){
          let bulb = new Bulb(this, object.x, object.y);
          this.bulbs.add(bulb)
          this.energyLayer.add(bulb)
        }

        if (object.name.startsWith("energy")){
          this.energy = new Energy(this, object.x, object.y, this.grid)
          this.energyLayer.add(this.energy)
        }
      })

    }

    addLight() {
      this.lights.enable();
      this.lights.setAmbientColor(0xd0d0d0);
    }

    updateGrid () {
      this.grid = [];

      Array(19).fill(0).forEach((_,i) => {
        this.grid[i] = []
        Array(19).fill(0).forEach((_, j) => {
          let wall = this.platform.getTileAt(Math.floor(j), Math.floor(i));
          this.grid[i][j] = wall ?  1 : 0;
        });
      });
    }

    rearrange() {
      //this.tileMap.putTileAt(this.initialBlocks, 0, 0);
      this.disableBulbs();
      this.initialBlocks.forEach(tile => {
        this.platform.putTileAt(8, tile.x, tile.y)
      })

      this.switches.children.entries.forEach(switchy => {
        //console.log("Switch: ", switchy)
        const {x, y, width, height} = switchy.getBounds()

        //console.log("see: ", x, y, width, height)

        const tiles = this.tileMap.getTilesWithin( Math.floor(x/32), Math.floor(y/32), Math.floor(width / 32), Math.floor(height/ 32), {
          isNotEmpty: true,
          isColliding: true,
          hasInterestingFace: false
        }, `scene${this.number}`)
        
        //console.log("Tiles:", tiles)
        tiles.forEach(tile => this.platform.removeTileAt(tile.x, tile.y))
      })
      this.updateGrid();
      this.energy.updateGrid(this.grid)
      this.checkEnergy(this.grid);
    }

    checkEnergy () {
      this.bulbs.children.entries.forEach(bulb => {
        this.energy.searchPath(bulb);
      })
    }

    disableBulbs () {
      this.bulbs.children.entries.forEach(bulb => {
        bulb.deactivate();
      })
    }

    checkAll () {
      if (this.bulbs.children.entries.every(bulb => bulb.activated)) {
        this.finishScene();
      }
    }

    savePositions () {
      let positions = [];
      for (let i = 0; i < 19; i++)
        for (let j = 0; j < 19; j++) {
          const tile = this.platform.getTileAt(i, j)
          if (tile) positions.push({x: i, y: j})
        }
      
      return positions;
    }

    showTexts() {
      if (this.number > 0) return;
      const texts = ["Click on green swtiches and","Connect energy with bulbs"]
      texts.forEach((text, i) => {
       let help = this.add.bitmapText(this.center_width, 525 + (35 * i), "mario", text, 20).setOrigin(0.5).setTint(0xb95e00).setDropShadow(1, 1, 0xfffd00, 0.7);
     })
   }

    setListeners () {
      this.activeBlock = null;
      this.blocks.setInteractive();
      this.blocks.on("pointerdown", (pointer) => {
        if (this.activeBlock)
          this.activeBlock.deactivate()
      });
    }

    addPointer() {
      this.pointer = this.input.activePointer;
      this.input.mouse.disableContextMenu();
    }

      loadAudios () {
        this.audios = {
          "bump": this.sound.add("bump"),
          "hover": this.sound.add("hover"),
          "select": this.sound.add("select"),
          "move": this.sound.add("move"),
          "win": this.sound.add("win"),
          "prewin": this.sound.add("prewin"),
          "switch": this.sound.add("switch"),
        };
      }

      playMusic (theme="music") {
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
      this.playAudio("prewin")
      this.playAudio("win")
      this.solved = true;
      const totalMoves = +this.registry.get("moves") + this.totalMoves;
      this.registry.set("moves", totalMoves)

      this.winText1 = this.add.bitmapText(-100, this.center_height, "mario", "STAGE", 30).setOrigin(0.5).setTint(0xb95e00).setDropShadow(2, 3, 0xfffd00, 0.7);
      this.winText2 = this.add.bitmapText(this.width + 100, this.center_height, "mario", "LIT UP", 30).setOrigin(0.5).setTint(0xb95e00).setDropShadow(2, 3, 0xfffd00, 0.7);
      this.boltsm = this.add.sprite(this.center_width, this.center_height, "boltsm")
      this.tweens.add({ 
        targets: this.winText1,
        duration: 500,
        x: {from: this.winText1.x, to: this.center_height - 100}
      })
      this.tweens.add({
        targets: this.winText2,
        duration: 500,
        x: {from: this.winText2.x, to: this.center_height + 105}
      })
      this.tweens.add({
        targets: [this.winText1, this.winText2,  this.movesText, this.boltsm],
        duration: 100,
        scale: {from: 1, to: 1.1},
        repeat: -1,
        yoyo: true
      })
      this.time.delayedCall(2000, () => {
        this.game.sound.stopAll();
        this.scene.start("transition", {next: "underwater", name: "STAGE", number: this.number + 1});
      }, null, this)
    }

    restartScene () {
        this.scene.start("game", {next: "underwater", name: "STAGE", number: this.number });
    }


    updateMoves () {
      this.totalMoves++;
      this.movesText.setText(this.totalMoves);
      this.tweens.add({
        targets: [this.timerText],
        duration: 200,
        alpha: {from: 0.6, to: 1},
        repeat: -1
      })
    }
}
