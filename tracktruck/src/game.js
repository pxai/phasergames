import Player from "./player";
import Starfiled from "./objects/starfield";
import AsteroidField from "./objects/asteroid_field";
import ContainerGenerator from "./objects/container_generator";

export default class Game extends Phaser.Scene {
    constructor ({ key }) {
        super({ key: "game" });
        this.player = null;
        this.cursors = null;
        this.score = 0;
        this.scoreText = null;
    }

    init (data) {
      this.name = data.name;
      this.number = data.number;
      this.time = data.time;
  }

    preload () {
    }

    create () {
      // this.add.tileSprite(0, 0, 800, 600, 'background1').setOrigin(0,0);
      // 494d7e
      console.log("Scene time: ", this.time);
      this.duration = this.time * 1000;
      this.width = this.sys.game.config.width;
      this.height = this.sys.game.config.height;
      this.center_width = this.width / 2;
      this.center_height = this.height / 2;
      this.physics.world.setBounds(0, 0, 1600, 1200);
      this.finished = false;
      this.starfield = new Starfiled(this);
      this.asteroidField = new AsteroidField(this);
      this.containerGenerator = new ContainerGenerator(this);
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
        this.cameras.main.setBounds(0, 300, 800, 600);
        // this.cameras.main.focusOnXY(-800, -600);
        //this.camera.
        this.starfield.generate();
        this.asteroidField.generate();
        this.containerGenerator.generate();
        this.cameras.main.setBackgroundColor(0x494d7e);
        // this.cameras.main.startFollow(this.player);
        // this.zoomOut(0.5);
        this.finishStageId = setTimeout(() => this.finishStage(), this.duration);
      }

      finishStage () {
          this.starfield.stop();
          this.asteroidField.stop();
          this.containerGenerator.stop();
          this.zoomOut(0.5);
          this.showFinish();
      }

      zoomOut (zoomAmount) {
        this.cameras.main.zoomTo(zoomAmount, 500);
      }

      showFinish () {
        this.planet = this.add.image(1800, 400, "planet").setOrigin(0.5).setTint(0xffffff * Math.random());
        this.planet.rotation = 100 * Math.random();
        this.player.disablePlayer();
        this.input.keyboard.on("keydown-SPACE", () => this.finishScene(), this);
      }

      showResult () {
        //this.add.rectangle(50, 50, 1700, 1100, 0x000, 0.7).setOrigin(0.5);
        this.totalScore = 0;
        this.titleResult = this.add.bitmapText(this.center_width * 2, 400, "pixelFont", `${this.name} ${this.number} TOTAL SCORE`, 60).setOrigin(0.5)
        this.totalContainersResult = this.add.bitmapText(this.center_width * 2, 500, "pixelFont", "TOTAL CONTAINERS: " + this.player.containers.length, 50).setOrigin(0.5)
        this.containerInfo1 = this.add.bitmapText(this.center_width * 2, 800, "pixelFont", "", 40).setOrigin(0.5)
        this.containerInfo2 = this.add.bitmapText(this.center_width * 2, 860, "pixelFont", "", 40).setOrigin(0.5)
        this.containerInfo3 = this.add.bitmapText(this.center_width * 2, 920, "pixelFont", "", 40).setOrigin(0.5)
        if (this.player.containers.length === 0) {
          this.add.bitmapText(this.center_width * 2, 800, "pixelFont", `YOU SUCK!!`, 120).setOrigin(0.5)
        } 
        this.showContainersTimeoutId = [];
        this.player.containers.forEach( (container, i) => {
          this.showContainersTimeoutId.push(setTimeout(() => this.showContainer(container, i), 1000 * (i+1)));
        })
        this.textContinue= this.add.bitmapText(this.center_width * 2, 1100, "pixelFont", "Press SPACE", 35).setOrigin(0.5)
        this.finishSceneTimeoutId = setTimeout(() => this.finishScene(), 1000 * (this.player.containers.length + 1) + 1000);
      }

      crearFinishStuff () {
        clearTimeout(this.finishSceneTimeoutId);
        this.finishContainer.destroy();
        if (this.showContainersTimeoutId.length > 0)
          this.showContainersTimeoutId.forEach(timeoutId => {clearTimeout(timeoutId)});
      }


      showContainer (container, i) {
        this.totalScore += container.type.value;
        this.finishContainer = this.add.image((this.center_width * 2), 650, `container${container.type.id}`).setScale(0.8)
        this.containerInfo1.setText("Container: " + container.type.name);
        this.containerInfo2.setText(container.type.description);
        this.containerInfo3.setText("Value: " + container.type.value + "$");
        this.playAudio("lock");
        if (i === this.player.containers.length - 1) {
          this.textTotalScore = this.add.bitmapText(this.center_width * 2, 1000, "pixelFont", `Total: ${this.totalScore}$ !!`, 60).setOrigin(0.5)
          this.playAudio("lock");
        }
      }

      loadAudios () {
        this.audios = {
          "lock": this.sound.add("lock"),
          "thrust": this.sound.add("thrust"),
          "marble": this.sound.add("marble"),
          "shot": this.sound.add("shot"),
          "hit1": this.sound.add("hit1"),
          "hit2": this.sound.add("hit2"),
          "hit3": this.sound.add("hit3"),
          "hit4": this.sound.add("hit4"),
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

    finishScene () {
      this.crearFinishStuff();
      this.scene.start("transition", {name: "STAGE", number: this.number + 1, time: this.time * 2});
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
