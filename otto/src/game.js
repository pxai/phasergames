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


      //this.loadAudios();
      // this.playMusic();
      this.addMap();
      this.addPlayers();
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
      this.exit1 = new Exit(this, exit1Position.x + OFFSET, exit1Position.y + OFFSET, "exit1");
      this.exits.add(this.exit1);
      const exit2Position = this.objectsLayer.objects.find( object => object.name === "exit2")
      this.exit2 = new Exit(this, exit2Position.x + OFFSET, exit2Position.y + OFFSET, "exit2");
      this.exits.add(this.exit2);
    }

    hitExit(player, exit) {
      if (player.name === "player1" && exit.name === "exit1") {
        console.log("Player1 touched!")
        this.player1.touchingExit = true
      }

      if (player.name === "player2" && exit.name === "exit2") {
        console.log("Player2 touched!")
        this.player2.touchingExit = true
      }

      if (this.player1.touchingExit && this.player2.touchingExit) {
        this.finishScene()
      }
    }

    addTitle() {
      this.car1 = this.add.sprite(this.center_width + 256, 140, "player2").setOrigin(1, 0).setRotation(Math.PI/2).setScale(2)
      this.car2 = this.add.sprite(this.center_width - 256, 140, "player1").setOrigin(0, 0).setRotation(-Math.PI/2).setScale(2)
      this.titleText1 = this.add.bitmapText(this.center_width, 64, "pixelFont", "OT", 80).setOrigin(1,0).setTint(0xDEA551)
      this.titleText2 = this.add.bitmapText(this.center_width, 64, "pixelFont", "TO", 80).setOrigin(0, 0).setTint(0x518ADE)
    }

    addMovesText () {
      this.movesText = this.add.bitmapText(this.center_width, 164, "pixelFont", this.registry.get("moves"), 40).setOrigin(0.5)
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

    moveDown() {
      this.updateMoves()
      if (this.canMove(this.player1.x, this.player1.y + STEP)) {
        this.player1.down();
      }

      if (this.canMove(this.player2.x, this.player2.y - STEP, "red")) {
        this.player2.up();
      }

    }

    moveUp() {
      this.updateMoves()
      if (this.canMove(this.player1.x, this.player1.y - STEP)) {
        this.player1.up();
      }

      if (this.canMove(this.player2.x, this.player2.y + STEP, "red")) {
        this.player2.down();
      }

    }

    moveRight() {
      this.updateMoves()
      if (this.canMove(this.player1.x + STEP, this.player1.y)) {
        this.player1.right();
      }

      if (this.canMove(this.player2.x - STEP, this.player2.y, "red")) {
        this.player2.left();
      }
    }

    moveLeft() {
      this.updateMoves()
      if (this.canMove(this.player1.x - STEP, this.player1.y)) {
        this.player1.left();
      }
      if (this.canMove(this.player2.x + STEP, this.player2.y, "red")) {
        this.player2.right();
      }
    }

    canMove (x, y, color = "blue") {
      const point = this.cameras.main.getWorldPoint(x, y)
      const tile = this.platform.getTileAtWorldXY(point.x, point.y)
      console.log("Is there a tile: ", color,  !tile, tile)

      return !tile;
    }

    finishScene () {
      this.theme.stop();
      this.scene.start("transition", {number: this.number + 1});
    }

    restartScene () {
      this.theme.stop();
      this.scene.start("transition", {number: this.number});
    }

    updateMoves () {
        this.player1.touchingExit = false;
        this.player2.touchingExit = false;
        const moves = +this.registry.get("moves") + 1;
        this.registry.set("moves", moves);
        this.movesText.setText(moves);
    }
}
