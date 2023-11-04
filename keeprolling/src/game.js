import Player from "./player";
import Exit from "./exit";
import Help from "./help";

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


    create () {
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;

      this.addMap();
      this.addPlayer();
      this.addScore();
      this.addHelp();
      this.loadAudios();
      // this.playMusic();
    }


    addMap() {
      this.tileMap = this.make.tilemap({ key: `scene${this.number}` , tileWidth: 64, tileHeight: 64 });
      this.tileSet = this.tileMap.addTilesetImage("die");
      this.platform = this.tileMap.createLayer(`scene${this.number}`, this.tileSet);
      this.objectsLayer = this.tileMap.getObjectLayer('objects');
      this.platform.setAlpha(0.7)
      this.physics.world.setBounds(0, 0, this.width, this.height);

      this.texts = [];
      const exitPosition = this.objectsLayer.objects.find( object => object.name === "exit")
      this.exit = new Exit(this, exitPosition.x, exitPosition.y)
    }

    addPlayer () {
        this.trailLayer = this.add.layer();
        const playerPosition = this.objectsLayer.objects.find( object => object.name === "player")
        this.player = new Player(this, playerPosition.x, playerPosition.y, Phaser.Math.Between(1, 6));

        this.physics.add.collider(this.player, this.exit, this.hitExit, ()=>{
          return true;
        }, this);
    }

    addScore () {
      this.stepsText = this.add.bitmapText(this.center_width, 640, "pixelFont", "0", 32);
    }

    addHelp () {
      this.help = new Help(this, 13*64, 11*64, this.player.currentDie)
    }

    hitExit (player, exit) {
      console.log("Finished!!")
    }

      loadAudios () {
        this.audios = {
          "blip": this.sound.add("blip"),
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

    updateSteps (points = 1) {
        const score = +this.registry.get("steps") + points;
        this.registry.set("steps", score);
        this.stepsText.setText(score);
    }
}
