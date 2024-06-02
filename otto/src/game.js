import Player from "./player";
import Exit from "./exit";
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
      this.addPlayers();
      this.addControls();
      this.addTitle();
      this.addMovesText();
    }

    addControls () {
      this.cursor = this.input.keyboard.createCursorKeys();
      this.B = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
      this.R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
      this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    addMap() {
      this.waterTime = 0;
      this.tileMap = this.make.tilemap({ key: `scene${this.number}` , tileWidth: 25, tileHeight: 25 });

      this.tileSetBg = this.tileMap.addTilesetImage("otto");
      this.backgroundLayer = this.tileMap.createLayer('background', this.tileSetBg)

      this.tileSet = this.tileMap.addTilesetImage("otto");
      this.platform = this.tileMap.createLayer(`scene${this.number}`, this.tileSet);
      this.objectsLayer = this.tileMap.getObjectLayer('objects');

      this.platform.setCollisionByExclusion([-1]);

      this.addExits();
    }

    addPlayers () {
      this.players = this.add.group();
      const player1Position = this.objectsLayer.objects.find( object => object.name === "player1")
      this.player1 = new Player(this, player1Position.x + OFFSET, player1Position.y + OFFSET, "player1");
      this.players.add(this.player1);
      const player2Position = this.objectsLayer.objects.find( object => object.name === "player2")
      this.player2 = new Player(this, player2Position.x + OFFSET, player2Position.y + OFFSET, "player2");
      this.players.add(this.player2);

      this.physics.add.overlap(
        this.players,
        this.exits,
        this.hitExit,
        () => {
          return true;
        },
        this
      );
    }

    addExits () {
      this.exits = this.add.group();
      const exit1Position = this.objectsLayer.objects.find( object => object.name === "exit1")
      this.exit1 = new Exit(this, exit1Position.x + OFFSET, exit1Position.y + OFFSET, "exit1", 0x518ADE);
      this.exits.add(this.exit1);
      const exit2Position = this.objectsLayer.objects.find( object => object.name === "exit2")
      this.exit2 = new Exit(this, exit2Position.x + OFFSET, exit2Position.y + OFFSET, "exit2", 0xDEA551);
      this.exits.add(this.exit2);
    }

    hitExit(player, exit) {
      if (this.stageClear) return;
      if (player.name === "player1" && exit.name === "exit1") {
        console.log("Player1 touched!")
        this.player1.touchingExit = true
      }

      if (player.name === "player2" && exit.name === "exit2") {
        console.log("Player2 touched!")
        this.player2.touchingExit = true
      }

      if (this.player1.touchingExit && this.player2.touchingExit) {
        this.stageClear = true;
        this.finishScene()
      }
    }

    addTitle() {
      this.car1 = this.add.sprite(this.center_width + 256, 140, "player2").setOrigin(1, 0).setRotation(Math.PI/2).setScale(2)
      this.car1Position = {x: this.car1.x, y: this.car1.y};
      this.car2 = this.add.sprite(this.center_width - 256, 140, "player1").setOrigin(0, 0).setRotation(-Math.PI/2).setScale(2)
      this.car2Position = {x: this.car2.x, y: this.car2.y};
      this.titleText1 = this.add.bitmapText(this.center_width, 64, "pixelFont", "OT", 80).setOrigin(1,0).setTint(0xDEA551)
      this.titleText2 = this.add.bitmapText(this.center_width, 64, "pixelFont", "TO", 80).setOrigin(0, 0).setTint(0x518ADE)
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
        // TODO REMOVE
        if (Phaser.Input.Keyboard.JustUp(this.B))  {
          this.finishScene();
        }
    }

    moveDown() {
      this.updateMoves()
      if (this.canMove(this.player1.x, this.player1.y + STEP)) {
        this.player1.down();
      } else this.shakeIt(this.car2, this.car2Position)

      if (this.canMove(this.player2.x, this.player2.y - STEP, "red")) {
        this.player2.up();
      } else this.shakeIt(this.car1, this.car1Position)

    }

    moveUp() {
      this.updateMoves()
      if (this.canMove(this.player1.x, this.player1.y - STEP)) {
        this.player1.up();
      } else this.shakeIt(this.car2, this.car2Position)

      if (this.canMove(this.player2.x, this.player2.y + STEP, "red")) {
        this.player2.down();
      } else this.shakeIt(this.car1, this.car1Position)

    }

    moveRight() {
      this.updateMoves()
      if (this.canMove(this.player1.x + STEP, this.player1.y)) {
        this.player1.right();
      } else this.shakeIt(this.car2, this.car2Position)

      if (this.canMove(this.player2.x - STEP, this.player2.y, "red")) {
        this.player2.left();
      } else this.shakeIt(this.car1, this.car1Position)
    }

    moveLeft() {
      this.updateMoves()
      if (this.canMove(this.player1.x - STEP, this.player1.y)) {
        this.player1.left();
      } else this.shakeIt(this.car2, this.car2Position)
      if (this.canMove(this.player2.x + STEP, this.player2.y, "red")) {
        this.player2.right();
      } else this.shakeIt(this.car1, this.car1Position)
    }

    canMove (x, y, color = "blue") {
      const point = this.cameras.main.getWorldPoint(x, y)
      const tile = this.platform.getTileAtWorldXY(point.x, point.y)
      console.log("Is there a tile: ", color,  !tile, tile)

      return !tile;
    }

    playEngine(rate = 0.5, volume = 0.5) {
      if (!this.engine.isPlaying) {
        this.engine.play({
          rate: Phaser.Math.Between(8, 12)/10,
          volume: Phaser.Math.Between(1, 5)/10
        });
      }
    }

    shakeIt (element, original) {
      const {x, y} = element;
      this.tweens.add({
        targets: element,
        duration: 30,
        x: `+=${Phaser.Math.Between(2,10)}`,
        y: `+=${Phaser.Math.Between(2,10)}`,
        repeat: 10,
        yoyo: true,
        onComplete: () => {
          element.x = original.x;
          element.y = original.y;
        }
      })
    }

    finishScene () {
      this.playAudio("win")
      this.showWin()
      this.celebrate()
     // this.theme.stop();
     this.time.delayedCall(2000, ()=> {this.scene.start("transition", {number: this.number + 1});}, null, this)

    }

    showWin() {
      this.winText1 = this.add.bitmapText(this.center_width, - 100, "pixelFont", "Stage", 120).setOrigin(0.5).setTint(0xDEA551).setDropShadow(2, 2, 0x518ADE, 0.7);
      this.winText2 = this.add.bitmapText(this.center_width,  1000, "pixelFont", "Cleared", 120).setOrigin(0.5).setTint(0x518ADE).setDropShadow(2, 2, 0xDEA551, 0.7);
      this.tweenThis(this.winText1, 500, -80)
      this.tweenThis(this.winText2, 500, 80)
    }

    tweenThis(element, duration = 1000, offset = 0) {
      this.tweens.add({
          targets: element,
          duration,
          y: {
            from: element.y,
            to: this.center_height + offset
          },
        })
      this.tweens.add({
        targets: element,
        scale: {from: 0.9, to: 1},
        duration: 50,
        repeat: 10,
        yoyo: true
      })
    }

    restartScene () {
      //this.theme.stop();
      this.scene.start("transition", {number: this.number});
    }

    updateMoves () {
        this.player1.touchingExit = false;
        this.player2.touchingExit = false;
        const moves = +this.registry.get("moves") + 1;
        this.registry.set("moves", moves);
        this.movesText.setText(moves);
    }

    celebrate () {
      Array(Phaser.Math.Between(200, 300)).fill().forEach(i => {
        const star = this.add.sprite(Phaser.Math.Between(32, 900), Phaser.Math.Between(32, 800), "star").setTint(Phaser.Math.RND.pick([0xDEA551, 0x518ADE]))
        this.tweens.add({
          targets: star,
          duration: 400,
          scale: {from: 0, to: 1},
          yoyo: true,
          onComplete: () => {
            star.destroy()
          }
        })
      })
    }
}
