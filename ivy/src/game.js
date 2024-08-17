import Player from "./player";
import Exit from "./exit";
import Ivy from "./ivy";
const OFFSET = 16;
const STEP = 32;

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
      this.stageClear = false;

      this.loadAudios();
      // this.playMusic();
      this.addMap();
      this.addPlayer();
      this.addControls();
      this.addTitle();
      this.addMovesText();
    }

    addControls () {
      this.cursor = this.input.keyboard.createCursorKeys();
      this.R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
      this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    addMap() {
      this.waterTime = 0;
      this.tileMap = this.make.tilemap({ key: `scene${this.number}` , tileWidth: 25, tileHeight: 25 });

      this.tileSetBg = this.tileMap.addTilesetImage("ivy");
      this.backgroundLayer = this.tileMap.createLayer('background', this.tileSetBg)

      this.tileSet = this.tileMap.addTilesetImage("ivy");
      this.platform = this.tileMap.createLayer(`scene${this.number}`, this.tileSet);
      this.objectsLayer = this.tileMap.getObjectLayer('objects');

      this.platform.setCollisionByExclusion([-1]);

      this.ivies = this.add.group()

      this.objectsLayer.objects.forEach( object => {
        console.log(object.name)
          if (object.name.startsWith("ivy")) {
            this.ivies.add(new Ivy(this, object.x, object.y));
          }
      })

      this.addExit();
    }

    addPlayer () {
      const player1Position = this.objectsLayer.objects.find( object => object.name === "player1")
      this.player = new Player(this, player1Position.x + OFFSET, player1Position.y + OFFSET, "player1");

      this.physics.add.collider(
        this.player,
        this.platform,
        this.hitPlatform,
        () => {
          return true;
        },
        this
      );

      this.physics.add.overlap(
        this.player,
        this.exit,
        this.hitExit,
        () => {
          return true;
        },
        this
      );

      this.physics.add.overlap(
        this.player,
        this.ivies,
        this.iviTouch,
        () => {
          return true;
        },
        this
      );
    }

    iviTouch(player, ivy) {
      this.iviTouching = true;
      console.log("Overlap!!")
      this.player.body.setGravityY(0)
      this.player.body.stop()
      this.player.body.setAllowGravity(false)
      this.player.body.setImmovable(true);
    }

    iviTouchEnd(player, ivy) {
      this.iviTouching = false;
      this.player.body.setGravityY(100)
      this.player.body.setAllowGravity(true)
      this.player.body.setImmovable(false);
    }

    hitPlatform(player, platform) {
    }

    addExit () {
      const exit1Position = this.objectsLayer.objects.find( object => object.name === "exit")
      this.exit = new Exit(this, exit1Position.x + OFFSET, exit1Position.y + OFFSET, "exit", 0xA13647);
    }

    hitExit(player, exit) {
      if (this.stageClear) return;
      this.stageClear = true;
      this.finishScene()
    }

    addTitle() {
      this.car1 = this.add.sprite(this.center_width + 256, 140, "player2").setOrigin(1, 0).setRotation(Math.PI/2).setScale(2)
      this.car1Position = {x: this.car1.x, y: this.car1.y};
      this.car2 = this.add.sprite(this.center_width - 256, 140, "player1").setOrigin(0, 0).setRotation(-Math.PI/2).setScale(2)
      this.car2Position = {x: this.car2.x, y: this.car2.y};
      this.titleText1 = this.add.bitmapText(this.center_width, 64, "pixelFont", "OT", 80).setOrigin(1,0).setTint(0x4A9130)
      this.titleText2 = this.add.bitmapText(this.center_width, 64, "pixelFont", "TO", 80).setOrigin(0, 0).setTint(0xA13647)
    }

    addMovesText () {
      this.movesText = this.add.bitmapText(this.center_width, 164, "pixelFont", this.registry.get("moves"), 40).setOrigin(0.5)
    }

    loadAudios () {
      this.engine = this.sound.add("engine")
      this.audios = {
        "win": this.sound.add("win"),
        "move": this.sound.add("move"),
        "engine": this.sound.add("engine"),
      };
    }

    playAudio(key, volume=.3) {
      this.audios[key].play({volume});
    }

    update() {
      if (!this.ivyTouching) {
        console.log("Overlap finished")
      }
      return
        if (
          (Phaser.Input.Keyboard.JustUp(this.S) ||
            Phaser.Input.Keyboard.JustUp(this.cursor.down))
        ) {
          this.moveDown();
        } else if (
          (Phaser.Input.Keyboard.JustUp(this.W) ||
            Phaser.Input.Keyboard.JustUp(this.cursor.up))
        ) {
          this.moveUp();
        } else if (
          (Phaser.Input.Keyboard.JustUp(this.D) ||
            Phaser.Input.Keyboard.JustUp(this.cursor.right))
        ) {
          this.moveRight();
        } else if (
          (Phaser.Input.Keyboard.JustUp(this.A) ||
            Phaser.Input.Keyboard.JustUp(this.cursor.left))
        ) {
          this.moveLeft();
        }
        if (Phaser.Input.Keyboard.JustUp(this.R))  {
          this.restartScene();
        }
    }


    playEngine(rate = 0.5, volume = 0.5) {
      if (!this.engine.isPlaying) {
        this.engine.play({
          rate: Phaser.Math.Between(8, 12)/10,
          volume: Phaser.Math.Between(1, 5)/10
        });
      }
    }

    finishScene () {
      this.playAudio("win")
      this.showWin()
     // this.theme.stop();
     this.time.delayedCall(2000, ()=> {this.scene.start("transition", {number: this.number + 1});}, null, this)

    }

    showWin() {
      this.winText1 = this.add.bitmapText(this.center_width, - 100, "pixelFont", "Stage", 120).setOrigin(0.5).setTint(0x4A9130).setDropShadow(2, 2, 0xA13647, 0.7);
      this.winText2 = this.add.bitmapText(this.center_width,  1000, "pixelFont", "Cleared", 120).setOrigin(0.5).setTint(0xA13647).setDropShadow(2, 2, 0x4A9130, 0.7);
    }

    restartScene () {
      //this.theme.stop();
      this.scene.start("transition", {number: this.number});
    }
}
