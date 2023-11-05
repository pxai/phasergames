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
      this.steps = 0;
      this.points = 1000;
      this.stageCompleted = false;

      this.addMap();
      this.addPlayer();
      this.addScore();
      this.addTitle();
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

      this.objectsLayer.objects.forEach( object => {
        if (object.name === "text") {
          this.texts.push(object);
        }
      })

      this.showTexts();
    }

    addPlayer () {
        this.trailLayer = this.add.layer();
        const playerPosition = this.objectsLayer.objects.find( object => object.name === "player")
        this.player = new Player(this, playerPosition.x, playerPosition.y, Phaser.Math.Between(1, 6));

        this.physics.add.collider(this.player, this.exit, this.hitExit, ()=>{
          return true;
        }, this);
    }

    addTitle () {
      this.title1 = this.add.bitmapText(this.width - 220, 70, "default", "Keep", 64).setTint(0x618fc0).setOrigin(0.5);
      this.title2 = this.add.bitmapText(this.width - 220, 130, "default", "Rolling", 64).setTint(0x618fc0).setOrigin(0.5);
    }

    addScore () {
      this.stepsText = this.add.bitmapText(this.width - 220, 480, "default", `Stage steps: ${this.steps}\n  Total: ${this.registry.get("steps")}`, 32).setOrigin(0.5);
      this.pointsText = this.add.bitmapText(this.width - 220, 580, "default", `Stage points: ${this.points}\n  Total: ${this.registry.get("points")}`, 32).setOrigin(0.5);

    }

    showTexts() {
      this.texts.forEach(text => {
       let help = this.add.bitmapText(text.x, text.y, "default", text.type, 20).setOrigin(0).setTint(0xffffff).setDropShadow(1, 2, 0x618fc0, 0.7);
       this.tweens.add({
         targets: help,
         duration: 10000,
         alpha: { from: 1, to: 0},
         ease: 'Linear'
       })
     })
   }

    addHelp () {
      this.help = new Help(this, 12*64, 5*64, this.player.currentDie)
    }

    hitExit (player, exit) {
      if (this.stageCompleted) return;
      console.log("Finished!!")
      this.stageCompleted = true;
      this.finishScene();
    }

      loadAudios () {
        this.audios = {
          "blip": this.sound.add("blip"),
          "step": this.sound.add("step"),
          "fail": this.sound.add("fail"),
          "win": this.sound.add("win"),
        };
      }

      playAudio(key) {
        this.audios[key].play();
      }

      playStep(value) {
        this.audios["step"].play({
          rate: Phaser.Math.Between(1, 1.5),
          detune: Phaser.Math.Between(-1000, 1000),
          volume: 0.4 + (value/10.0),
          delay: 0
        });
      }

    playAudioRandomly(key) {
      this.audios[key].play({
        rate: Phaser.Math.Between(1, 1.5),
        detune: Phaser.Math.Between(-1000, 1000),
        delay: 0
      });
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
      this.updateFinalPoints();
      //this.theme.stop();

      this.playAudio("win")
      this.time.delayedCall(2000, () => {
        this.scene.start("transition", { number: this.number + 1});
      }, null, this);

    }

    updateSteps (points = 1) {
      this.steps += points;
      const score = +this.registry.get("steps") + points;
      this.registry.set("steps", score);
      this.stepsText.setText(`Stage steps: ${this.steps}\n Total: ${score}`);
      this.updatePoints(-5)
    }

    updatePoints (points = 1) {
      if (points === 6) this.cameras.main.shake(100);
      this.points += points;
      const score = +this.registry.get("points") + points;
      this.pointsText.setText(`Stage points: ${this.points}\n Total: ${this.registry.get('points')}`);
    }

    updateFinalPoints () {
      const score = +this.registry.get("points") + this.points;
      this.registry.set("points", score);
      this.pointsText.setText(`Stage points: ${this.points}\n Total: ${this.registry.get('points')}`);
    }
}
