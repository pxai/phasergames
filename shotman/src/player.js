import Shot from "./shot";

export default class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y, "willie")
        this.setOrigin(0.5)
        this.scene = scene;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setDrag(300);
        this.velocity = 150;
        this.dead = false;
        this.init();
        this.shells = 0;
        this.lastDirection = 0;
    }

    init () {
        this.addControls();
        this.scene.events.on("update", this.update, this);
    }

    addControls() {
        this.cursor = this.scene.input.keyboard.createCursorKeys();
        this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update () {
        if (this.dead) return;

        if (this.W.isDown || this.cursor.up.isDown) {
            this.body.setVelocityY(-this.velocity);
            this.lastDirection = 0;
        } else if (this.D.isDown || this.cursor.right.isDown) {
            //this.anims.play("playerwalk" + this.number, true); }
            this.right = true;
            this.flipX = (this.body.velocity.x < 0);
            this.body.setVelocityX(this.velocity);
            this.lastDirection = 1;
        } else if (this.A.isDown || this.cursor.left.isDown) {
            this.right = false;
            this.flipX = (this.body.velocity.x < 0);
            this.body.setVelocityX(-this.velocity);  
            this.lastDirection = 3;
        } else if (this.S.isDown || this.cursor.down.isDown)  {
            this.body.setVelocityY(this.velocity);
            this.lastDirection = 2;
        } else {
            this.body.stop();
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceBar) && this.shells > 0) {
            this.shoot();
        }
    }

    shoot () {
        const {x, y} = [
            {x: 0, y: -1},
            {x: 1, y: 0},
            {x: 0, y: 1},
            {x: -1, y: 0},
        ][this.lastDirection];
        this.scene.shots.add(new Shot(this.scene, this.x + (x * 32), this.y + (x * 32), x, y))
        this.shells--;
    }

}