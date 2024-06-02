import { Dust } from "./dust.js";
import { Trail } from "./trail.js";
const STEP = 32;

export default class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name) {
        super(scene, x, y, name);
        this.name = name;
        this.setScale(1);
        this.scene = scene;
        this.initialRotation = this.name === "player1" ? 0 : Math.PI;
        this.direction = this.name === "player1" ? "up" : "down";
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
            scaleX: {from: 1, to: 0.95},
            repeat: -1,
            duration: 100,
            yoyo: true,
            onUpdate: function (tween, target, key, current, previous, param) {
                if (Phaser.Math.Between(0, 51) > 50)
                target.showTrail(target)
            },
        })
    }

    up () {
        this.scene.playAudio("move")
        this.move()
        new Trail(this.scene, this.x, this.y, this.color, "trail")
        this.y -= STEP;
        this.direction = "up";
        this.rotation = this.initialRotation;
        this.setRotation(0)
    }

    down () {
        this.scene.playAudio("move")
        this.move()
        new Trail(this.scene, this.x, this.y, this.color, "trail")
        this.y += STEP;
        this.direction = "down";
        this.rotation = this.initialRotation;
        this.setRotation(Math.PI)
    }

    left () {
        this.scene.playAudio("move")
        this.move()
        new Trail(this.scene, this.x, this.y, this.color)
        this.x -= STEP;
        this.direction = "left";
        this.rotation = this.initialRotation;
        this.setRotation(-Math.PI/2)
    }

    right () {
        this.scene.playAudio("move")
        this.move()
        new Trail(this.scene, this.x, this.y, this.color)
        this.x += STEP;
        this.direction = "right";
        this.rotation = this.initialRotation;
        this.setRotation(Math.PI/2)
    }

    showTrail (target) {
        const offsets = {
            "up": {x: 0, y: 32},
            "right": {x: -32, y: 0},
            "down": {x: 0, y: -32},
            "left": {x: 32, y: 0},
        }[target.direction]
        new Dust(target.scene, target.x +  offsets.x, target.y + offsets.y, 1, 1, target.color).setOrigin(0.5)
    }

    move () {
        let x = Phaser.Math.Between(-8, 8);
        let y = Phaser.Math.Between(-8, 8);
        new Dust(this.scene, this.x +  y, this.y + y, 1, 1, this.color);
        x = Phaser.Math.Between(-8, 8);
        y = Phaser.Math.Between(-8, 8);
        new Dust(this.scene, this.x + x, this.y + y, 1, 1, this.color);
      }

}
