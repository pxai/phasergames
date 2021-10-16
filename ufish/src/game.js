import Player from "./player";

import FishGenerator from "./objects/fish_generator";
import FoeGenerator from "./objects/foe_generator";
import Sky from "./objects/sky";
import Water from "./objects/water";

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
      this.addSky();

     /* this.containerGenerator = new ContainerGenerator(this);*/

        this.player = new Player(this, this.center_width, 200 )//.setOrigin(0.5); // this.physics.add.sprite(100, 450, 'dude');

        this.physics.world.setBoundsCollision(false, true, true, true);

        // this.physics.world.enable(this.ground, 1);
        this.scoreText = this.add.bitmapText(100, 16, "pixelFont", "0", 20).setOrigin(0.5)
       // this.loadAudios();

       // this.playMusic();

        this.fishGenerator = new FishGenerator(this);
        this.foeGenerator = new FoeGenerator(this);
       // this.overlap = this.physics.add.overlap(this.player.beamGroup, this.fishGenerator.fishGroup, this.trackFish);

       this.addWater();
       this.overlapFishWater = this.physics.add.overlap(this.water.surface, this.fishGenerator.fishGroup, this.surfaceTouch);
       this.overlapPlayer = this.physics.add.overlap(this.player, this.fishGenerator.fishGroup, this.catchFish);

  
      }

      addSky() {
        this.sky = new Sky(this);
      }

      addWater() {
        this.water = new Water(this);
      }

      finishStage () {
          this.stageFinished = true;
      }

      trackFish (beam, fish) {
        fish.up(beam);
       // fish.disableBody(false, false);
      }

      catchFish(player, fish) {
        console.log("Fish caught!!", player, fish);
        player.scene.updateScore(1);
        fish.destroy()
      }

      surfaceTouch(surface, fish) {
        if (fish.body.velocity.y < 0) {
          fish.setAlpha(1)
        } else {
          fish.setAlpha(0.5)
        }
      }

      showContainer (container, i) {
        this.totalScore += container.type.value;
        this.finishContainer = this.add.image((this.center_width * 2), 650, `container${container.type.id}`).setScale(0.8)
        this.containerInfo1.setText("Container: " + container.type.name);
        this.containerInfo2.setText(container.type.description);
        this.containerInfo3.setText("Value: " + container.type.value + "$");
        this.playAudio("lock");
        if (i === this.player.containers.length - 1) {
          this.textTotalScore = this.add.bitmapText(this.center_width * 2, 1000, "pixelFont", `Stage total: ${Number(this.totalScore).toLocaleString()}$ !!`, 55).setOrigin(0.5)
          this.playAudio("lock");
          this.showAccumulatedScore(this.totalScore);
        }
      }

      showAccumulatedScore(partialScore) {
        this.updateScore(partialScore);
        const accumulatedScore = +this.registry.get("score")
        this.textAccumulatedScore = this.add.bitmapText(this.center_width * 2, 1100, "pixelFont", `Total score: ${Number(accumulatedScore).toLocaleString()}$ !!`, 60).setOrigin(0.5)
        this.playAudio("lock");
        this.textContinue= this.add.bitmapText(this.center_width * 2, 1200, "pixelFont", "Press SPACE", 35).setOrigin(0.5)
      }

      loadAudios () {
        this.audios = {
          "lock": this.sound.add("lock"),
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
        this.player.update();
        this.sky.update();
        this.fishGenerator.update();
    }

    finishScene () {

      this.theme.stop();
      this.scene.start("transition", {name: "STAGE", number: this.number + 1, time: this.time * 2});
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }

    updateContainers (amount) {
        this.registry.set("containers", amount);
    }

    updateHull (amount = 1) {
      this.registry.set("hull", amount);
    }
}
