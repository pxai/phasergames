import Player from "./player";
import Starfiled from "./objects/starfield";
import AsteroidField from "./objects/asteroid_field";
import ContainerGenerator from "./objects/container_generator";

export default class Game extends Phaser.Scene {
    constructor ({ key }) {
        super({ key });
        this.player = null;
        this.cursors = null;
        this.score = 0;
        this.scoreText = null;
    }

    preload () {
    }

    create () {
      // this.add.tileSprite(0, 0, 800, 600, 'background1').setOrigin(0,0);
      this.physics.world.setBounds(0, 0, 1600, 1200);
      this.finished = false;
      this.starfield = new Starfiled(this);
      this.asteroidField = new AsteroidField(this);
      this.containerGenerator = new ContainerGenerator(this);
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2

        const greenBeans = +this.registry.get("containers");
        const redBeans = +this.registry.get("hull");
        this.player = new Player(this, 100, this.height - 32, "ship", greenBeans, redBeans)//.setOrigin(0.5); // this.physics.add.sprite(100, 450, 'dude');

        this.physics.world.setBoundsCollision(false, true, true, true);

        this.ground = this.add.rectangle(this.center_width, this.height, this.width, 1, 0x000000, 0);
        this.physics.world.enable(this.ground, 1);
     //   this.scoreText = this.add.bitmapText(this.center_width, 16, "pixelFont", "SCORE", 20).setOrigin(0.5)
        this.loadAudios();
     //   this.updateScore();
        // this.playMusic();
        this.cameras.main.setBounds(0, 0, 800, 600);
        // this.cameras.main.focusOnXY(-800, -600);
        //this.camera.
        this.starfield.generate();
        this.asteroidField.generate();
        this.containerGenerator.generate();
        this.cameras.main.startFollow(this.player);
        // this.zoomOut(0.5);
      }


      zoomOut (zoomAmount) {
        this.cameras.main.zoomTo(zoomAmount, 500);
        //this.cameras.main.scale.x += zoomAmount;
        //this.cameras.main.scale.y += zoomAmount;

       /* this.cameras.main.bounds.x =  * this.cameras.main.scale.x;
        this.cameras.main.bounds.y = size.y * this.cameras.main.scale.y;
        this.cameras.main.bounds.width = size.width * this.cameras.main.scale.x;
        this.cameras.main.bounds.height = size.height * this.cameras.main.scale.y;*/
      }

      loadAudios () {
        this.audios = {
          // "albatdeath": this.sound.add("albatdeath"),
        };
      }

      playAudio(key) {
        this.audios[key].play();
      }

      playMusic (theme="music") {

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
      if (!this.player.isPlayerDead()) {
        this.player.update();
        this.starfield.update();
        this.asteroidField.update();
        this.containerGenerator.update();
      }
    }

    playerDeath (player, star) {
      this.finished = true;
      console.log("Death!!", player);
     // this.playAudio("playerdeath");
      player.finish();

      this.playerRestartId = setTimeout(() => this.playerRestart(), 2000);
    }

    playerRestart () {
      this.player.restart();
     // this.playAudio("playerreturn");
      console.log("Come from death: ", this.player.body.y, this.player.body.y + 100 < this.height);
      if (this.player.body.y + 100 < this.height) {
        this.player.y += 100;
      }
    }

    finishScene (player, door) {
      this.nextSceneId = setTimeout(() => this.scene.start("transition", {name: this.nextScene, nextScene: this.nextScene}), 3000);
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText("SCORE " +  String(score).padStart(6, '0'));
    }

    updateContainers (amount) {
        this.registry.set("containers", amount);
    }

    updateHull (amount = 1) {
      this.registry.set("hull", amount);
    }
}
