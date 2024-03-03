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
        this.body.setBounce(0.8)
        this.angle = 0;
        this.speed = 0;
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

    destroy () {
        this.death = true;
        super.destroy();
    }
}

export default Player;