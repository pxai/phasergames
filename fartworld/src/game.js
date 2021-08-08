import Player from "./player";
import BeanGenerator from "./objects/bean _generator";
import FoeGenerator from "./objects/foe_generator";

export default class Game extends Phaser.Scene {
    constructor ({ key }) {
        super({ key });
        this.player = null;
        this.cursors = null;
        this.score = 0;
        this.scoreText = null;

        console.log("Game constructor");
    }

    preload () {

      console.log("Game preload!", this.finished)

    }

    create () {
      this.finished = false;
      console.log("Game create: ", this.finished)
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2

        const greenBeans = +this.registry.get("green");
        const redBeans = +this.registry.get("red");
        this.player = new Player(this, 100, this.height - 32, "aki", greenBeans, redBeans); // this.physics.add.sprite(100, 450, 'dude');

        this.platformsLayer = this.add.layer();
        this.beanGenerator = new BeanGenerator(this);
        this.foeGenerator = new FoeGenerator(this);
        this.physics.world.setBoundsCollision(true, true, true, true);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.scoreText = this.add.bitmapText(this.center_width, 16, "pixelFont", "SCORE", 20).setOrigin(0.5)
        this.greenText = this.add.bitmapText(this.center_width - 200, 16, "pixelFont", this.registry.get("green"), 20).setOrigin(0.5);
        this.redText = this.add.bitmapText(this.center_width + 200, 16, "pixelFont", this.registry.get("red"), 20).setOrigin(0.5);
        this.updateScore();

        // this.createDeath(300, 450);
      }

    update() {
      if (!this.finished) {
        this.player.update();
        this.foeGenerator.update();
      }
    }

    createDoor(x, y) {
      this.door = this.add.sprite(x, y, "door");
      this.physics.add.existing(this.door)
      this.door.body.immovable = true;
      this.door.body.moves = false;
      this.doorOverlap = this.physics.add.overlap(this.player, this.door, this.finishScene, null, this);
    }

    createDeath(x, y) {
      this.star = this.add.sprite(x, y, "star");
      this.physics.add.existing(this.star)
      this.star.body.immovable = true;
      this.star.body.moves = false;
      this.starOVerlap = this.physics.add.overlap(this.player, this.star, this.playerDeath, null, this);
    }

    playerDeath (player, star) {
      this.finished = true;
      console.log("Death!!", player);
      player.finish();

      this.playerRestartId = setTimeout(() => this.playerRestart(), 3000);
    }

    playerRestart () {
      this.finished = false;
      this.player.restart();
      console.log("Come from death: ", this.player.body.y, this.player.body.y + 100 < this.height);
      if (this.player.body.y + 100 < this.height) {
        this.player.y += 100;
      }
    }

    finishScene (player, door) {
        this.finished = true;
        console.log("Finished!!", player, door);
        this.doorOverlap.active = false;
        player.finish();
        this.nextScene = "stage1";
        this.nextSceneId = setTimeout(() => this.scene.start("transition", {name: this.nextScene, nextScene: this.nextScene}), 3000);
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText("SCORE " +  String(score).padStart(6, '0'));
    }

    updateGreenBeans (amount) {
        this.registry.set("green", amount);
        this.greenText.setText(amount);
    }

    updateRedBeans (amount = 1) {
      this.registry.set("red", amount);
      this.redText.setText(amount);
    }
}
