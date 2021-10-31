import Phaser from "phaser";
import CellWall from "./cell_wall";
import BlockGenerator from "./block_generator";

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

        this.setGroups();
        this.blockGenerator = new BlockGenerator(this);
        this.setScores();
        this.setKeys();
        this.generateWall();
        this.generateBlock();
    }

    generateBlock () {
        this.current = this.blockGenerator.generate(this.wall.center);
        this.current.body.setCollideWorldBounds(true);
        this.blockGroup.add(this.current);
        this.colliderActivated = true;
       //  this.physics.world.enable([ this.current ]);
        this.wallCollider = this.physics.add.collider(this.current, this.platform, () => this.blockContact(), ()=>{
            return this.colliderActivated;
          }, this);
        
       /* this.physics.add.collider(this.current, this.blockGroup, () => this.blockContact2(), ()=>{
        return this.colliderActivated;
        }, this);*/
    }

    moveBlock () {
        this.current.moveDefault()
        console.log("Moved!")
    }

    generateWall () {
        this.wall = new CellWall(this);
    }

    setKeys () {
        this.cursor = this.input.keyboard.createCursorKeys();
        this.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.ESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        this.input.keyboard.on('keyup-LEFT', () => {
            //this.current.x -= this.current.x % 32;
        });
        this.input.keyboard.on('keyup-RIGHT', () => {
            //this.current.x += this.current.x % 32;
        });
        this.input.keyboard.on('keyup-UP', () => {
            //this.current.y -= this.current.y % 32;
        });
        this.input.keyboard.on('keyup-DOWN', () => {
            //this.current.y += this.current.y % 32;
        });
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
            //if (Phaser.Input.Keyboard.JustDown(this.cursor.left) || this.A.isDown) {
            if (Phaser.Input.Keyboard.JustDown(this.cursor.left)) {
                this.current.stopSpeed();
                this.current.defaultDirection = 1;
                this.current.left();
            }  else if (Phaser.Input.Keyboard.JustDown(this.cursor.right)) { // this.cursor.right.getDuration() > 100
                this.current.stopSpeed();
                this.current.defaultDirection = 0;
                this.current.right();
            } else if (Phaser.Input.Keyboard.JustDown(this.cursor.up)) {
                this.current.stopSpeed();
                this.current.defaultDirection = 3;
                this.current.up();
            } else if (Phaser.Input.Keyboard.JustDown(this.cursor.down)) {
                this.current.stopSpeed();
                this.current.defaultDirection = 2;
                this.current.down();
            } else if (this.SPACE.isDown) {
                this.current.speedUp();
            } else {
               // this.current.moveDefault();
            }
            this.current.correctPosition()
        }

        this.wall.update();
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
        this.current.setBlock()
        this.physics.world.removeCollider(this.wallCollider);
        console.log("Block contact!")
        // TODO remove block from group
        this.current = null;
        this.generateBlock();
    }

    blockContact2 () {
        this.current.setBlock()
        console.log("Block contact!")
        this.current = null;
        this.generateBlock();
    }
}
