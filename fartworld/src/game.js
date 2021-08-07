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

    preload () {
        console.log("preload");
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2
        // this.add.image(400, 300, 'sky');
        /* this.background = this.add.tileSprite(0, 0, this.width, this.height, "scene1");
        this.background.setOrigin(0, 0); */

        this.platformsLayer = this.add.layer();
        this.beanGenerator = new BeanGenerator(this);
        this.foeGenerator = new FoeGenerator(this);
        this.player = new Player(this, 100, 400, "grogu"); // this.physics.add.sprite(100, 450, 'dude');
        this.physics.world.setBoundsCollision(false, false, true, true);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.scoreText = this.add.text(this.center_width, 16, "SCORE", { font: '"Press Start 2P"', fontSize: "30px" }).setOrigin(0.5);
        this.greenText = this.add.text(this.center_width - 200, 16, this.registry.get("green"), { font: '"Press Start 2P"', fontSize: "30px" }).setOrigin(0.5);
        this.redText = this.add.text(this.center_width + 200, 16, this.registry.get("red"), { font: '"Press Start 2P"', fontSize: "30px" }).setOrigin(0.5);
        this.updateScore();
       // this.scoreText = this.add.text(16, 16, "score:" + this.registry.get("points"), { fontSize: "32px", fill: "#000" });
       // this.greenBeansText = this.add.text();
       // this.redBeansText = this.add.text();
      }

      update() {
        this.player.update();
            
       }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.text = "SCORE " +  String(score).padStart(6, '0');
    }

    updateGreenBeans (amount = 1) {
        const green = +this.registry.get("green") + amount;
        this.registry.set("green", green);
        this.greenText.text = green;
    }
}
