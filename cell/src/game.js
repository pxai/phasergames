import Phaser from "phaser";
import CellWall from "./cell_wall";
import BlockGenerator from "./block_generator";
import Bubble from "./bubble";

export default class Game extends Phaser.Scene {
    constructor () {
        super({ key: "game" });
    }

    preload () {
        this.load.image("logo", "assets/images/logo.png");
        this.load.audio("music", "assets/sounds/muzik.mp3");
        this.load.bitmapFont("pixelFont", "assets/fonts/font.png", "assets/fonts/font.xml");
    }

    create () {
        this.width = this.sys.game.config.width;
        this.height = this.sys.game.config.height;
        this.center_width = this.width / 2;
        this.center_height = this.height / 2;

        this.setGroups()
        this.blockGenerator = new BlockGenerator(this);
        this.setScores();
        this.setKeys();
        this.generateBlock();
    }

    generateBlock () {
        this.current = this.blockGenerator.generate();
        this.current.body.setCollideWorldBounds(true);
        this.blockGroup.add(this.current);
    }

    setKeys () {
        this.cursor = this.input.keyboard.createCursorKeys();
        this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.ESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
    }

    setScores() {
        this.scoreText = this.add.bitmapText(100, 16, "arcade", "0", 20).setOrigin(0.5).setScrollFactor(0)
        this.healthText = this.add.bitmapText(this.width - 100, 16, "arcade", this.registry.get("health"), 20).setOrigin(0.5).setScrollFactor(0)
    }

    setGroups () {
        this.sicknessGroup = this.add.group();
        this.blockGroup = this.add.group();
        this.physics.add.overlap(this.sicknessGroup, this.blockGroup, this.blockContact);
    }

    update () {
        if (this.ESC.isDown) {
           // this.theme.stop()
            this.scene.start('splash')
        }
      
        if (this.current) {
            if (this.cursor.left.isDown || this.A.isDown) {
                this.current.stopSpeed();
                this.current.defaultDirection = 1;
                this.current.left();
            } else if (this.cursor.right.isDown || this.D.isDown) {
                this.current.stopSpeed();
                this.current.defaultDirection = 0;
                this.current.right();
            } else if (this.cursor.up.isDown || this.W.isDown) {
                this.current.stopSpeed();
                this.current.defaultDirection = 3;
                this.current.up();
            } else if (this.cursor.down.isDown || this.S.isDown) {
                this.current.stopSpeed();
                this.current.defaultDirection = 2;
                this.current.down();
            } else if (this.SPACE.isDown) {
                this.current.speedUp();
            } else {
                this.current.moveDefault();
            }
        }
    }

    playMusic () {
        if (this.theme) this.theme.stop()
        this.theme = this.sound.add("music", {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        });
        this.sound.play("music");
    }

    updateScore (points = 0) {
        const score = +this.registry.get("score") + points;
        this.registry.set("score", score);
        this.scoreText.setText(Number(score).toLocaleString());
    }

    updateHealth (points = 0) {
        const health = +this.registry.get("health") + points;
        this.registry.set("health", health);
        this.healtText.setText(Number(health).toLocaleString());
    }

    blockContact () {
        console.log("Block contact!")
        // TODO remove block from group
        this.current = null;
    }
}
