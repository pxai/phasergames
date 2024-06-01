import { Dust } from "./dust.js";
const STEP = 32;

export default class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name) {
        super(scene, x, y, name);
        this.name = name;
        this.setScale(1);
        this.scene = scene;
        this.initialRotation = this.name === "player1" ? 0 : Math.PI;
        this.color = this.name === "player1" ? 0x518ADE : 0xDEA551;
        this.setRotation(this.initialRotation)
        this.setOrigin(0.5)
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.immovable = true;
        this.body.setAllowGravity(false);
        this.touchingExit = false
        this.init();
    }

    init () {
        this.scene.tweens.add({
            targets: this,
            scaleX: {from: 1, to: 0.9},
            repeat: -1,
            duration: 100,
            yoyo: true
        })
    }

    up () {
        this.move()
        this.y -= STEP;
        this.rotation = this.initialRotation;
        this.setRotation(0)
    }

    down () {
        this.move()
        this.y += STEP;
        this.rotation = this.initialRotation;
        this.setRotation(Math.PI)
    }

    left () {
        this.move()
        this.x -= STEP;
        this.rotation = this.initialRotation;
        this.setRotation(-Math.PI/2)
    }

    right () {
        this.move()
        this.x += STEP;
        this.rotation = this.initialRotation;
        this.setRotation(Math.PI/2)
    }

    move () {
        let x = Phaser.Math.Between(-10, 10);
        let y = Phaser.Math.Between(-10, 10);
        new Dust(this.scene, this.x +  y, this.y - 8 + y, 1, 1, this.color);
        x = Phaser.Math.Between(-10, 10);
        y = Phaser.Math.Between(-10, 10);
        new Dust(this.scene, this.x + 16 +y, this.y + y, 1, 1, this.color);
        x = Phaser.Math.Between(-10, 10);
        y = Phaser.Math.Between(-10, 10);
        new Dust(this.scene, this.x + y, this.y + 8 + y,  1, 1, this.color);
        x = Phaser.Math.Between(-10, 10);
        y = Phaser.Math.Between(-10, 10);
        new Dust(this.scene, this.x - 16 +y, this.y + y, 1, 1, this.color);
      }

}
