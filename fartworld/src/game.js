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
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2
        // this.add.image(400, 300, 'sky');
        /* this.background = this.add.tileSprite(0, 0, this.width, this.height, "scene1");
        this.background.setOrigin(0, 0); */
        const greenBeans = +this.registry.get("green");
        const redBeans = +this.registry.get("red");
        this.player = new Player(this, 100, this.height - 32, "aki", greenBeans, redBeans); // this.physics.add.sprite(100, 450, 'dude');

        this.platformsLayer = this.add.layer();
        this.beanGenerator = new BeanGenerator(this);
        this.foeGenerator = new FoeGenerator(this);

        this.physics.world.setBoundsCollision(false, false, true, true);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.scoreText = this.add.bitmapText(this.center_width, 16, "pixelFont", "SCORE", 20).setOrigin(0.5)
        this.greenText = this.add.bitmapText(this.center_width - 200, 16, "pixelFont", this.registry.get("green"), 20).setOrigin(0.5);
        this.redText = this.add.bitmapText(this.center_width + 200, 16, "pixelFont", this.registry.get("red"), 20).setOrigin(0.5);
        this.updateScore();
      }

      update() {
        this.player.update();
            
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
