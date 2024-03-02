import Particle from "./particle";

class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name) {
        super(scene, x, y, "ship1_1");
        this.scene = scene;
        this.name = name + ":" + crypto.randomUUID();
        this.tint = Math.random() * 0xffffff;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setCircle(26);
        this.body.setOffset(6, 9)
        this.power = 0;
        this.body.setBounce(0.8)
        this.speed_x = 0;// This is the speed it's currently moving at
        this.speed_y = 0;
        this.angle = 0;
        this.speed = 0; // This is the parameter for how fast it should move
        this.friction = .95;
        this.death = false;
        this.init();
    }

    init () {
        this.cursor = this.scene.input.keyboard.createCursorKeys();
        this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.body.setDrag(300);
        this.body.setAngularDrag(400);
        this.body.setMaxVelocity(600);
        this.upDelta = 0;
    }

    get key () {
        return this.name.split(":")[1];
    }

    update (timestep, delta) {
        if (this.death) return;
        if (this.cursor.left.isDown) {
            this.body.setAngularVelocity(-150);
        } else if (this.cursor.right.isDown) {
            this.body.setAngularVelocity(150);
        } else {
            this.body.setAngularVelocity(0);
        }

        if (this.cursor.up.isDown) {
            this.upDelta += delta;
            if (this.upDelta > 200) {
                this.upDelta = 0;
            }
            this.body.setVelocity(Math.cos(this.rotation) * 300, Math.sin(this.rotation) * 300);
        } else {
            this.body.setAcceleration(0);
        }

        if (Phaser.Math.Between(1, 4) > 1) {
            this.scene.thrust.add(new Particle(this.scene, this.x , this.y , 0xffffff, 10))
        }
    }

    getSpeeds () {
        let dx = (this.scene.input.mousePointer.x + this.scene.cameras.main.worldView.x) - this.x;
        let dy = (this.scene.input.mousePointer.y + this.scene.cameras.main.worldView.y) - this.y;
        let angle = Math.atan2(dy, dx) - Math.PI/2;
        let dir = (angle - this.rotation) / (Math.PI * 2);
        dir -= Math.round(dir);
        dir = dir * Math.PI * 2;

        this.newSpeed = (Math.abs(dx) + Math.abs(dy)/2)/100
        this.body.rotation += dir * 100
    }

    addEnergy(power) {
        this.power = this.power + power;
        this.showPoints("+" + power)
    }

    destroy () {
        this.death = true;
        super.destroy();
    }
}

export default Player;