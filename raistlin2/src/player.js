
import { JumpSmoke, RockSmoke, Particle } from "./particle";

class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, health = 10, tnt = 1, velocity = 200, remote = false) {
        super(scene, x, y, "raistlin")
        this.setOrigin(0.5)
        this.scene = scene;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.cursor = this.scene.input.keyboard.createCursorKeys();
        this.down = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.right = true;
        this.body.setGravityY(100)
        this.body.setSize(20, 30)
        this.init();
        this.jumping = false;
        this.flashing = false;
        this.falling = false;
        this.casting = false;
        this.finished = false;
        this.walkVelocity = velocity;
        this.jumpVelocity = -400;
        this.hasKey = false;

        this.health = health;

        this.dead = false;

        this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.R = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.scene.events.on("update", this.update, this);
    }

    init () {

        this.scene.anims.create({
            key: "startidle",
            frames: this.scene.anims.generateFrameNumbers("raistlin", { start: 1, end: 2 }),
            frameRate: 3,
            repeat: -1
        });

        this.scene.anims.create({
            key: "playeridle",
            frames: this.scene.anims.generateFrameNumbers("raistlin", { start: 1, end: 2 }),
            frameRate: 3,
            repeat: -1
        });

        this.scene.anims.create({
            key: "playerwalk",
            frames: this.scene.anims.generateFrameNumbers("raistlin", { start: 3, end: 4 }),
            frameRate: 10,
        });

        this.scene.anims.create({
            key: "playerjump",
            frames: this.scene.anims.generateFrameNumbers("raistlin", { start: 5, end: 5 }),
            frameRate: 1,
        });

        this.scene.anims.create({
            key: "playerfall",
            frames: this.scene.anims.generateFrameNumbers("raistlin", { start: 6, end: 6 }),
            frameRate: 1,
        });

        this.scene.anims.create({
            key: "playerspell",
            frames: this.scene.anims.generateFrameNumbers("raistlin", { start: 7, end: 8 }),
            frameRate: 10,
            repeat: 2
        });

        this.scene.anims.create({
            key: "playerdead",
            frames: this.scene.anims.generateFrameNumbers("raistlin", { start: 9, end: 14 }),
            frameRate: 5,
        });

        this.anims.play("startidle", true);

        this.on('animationcomplete', this.animationComplete, this);

        this.on('animationupdate', this.animationUpdate, this);
    }    

    update () {
        if (this.scene?.gameOver || this.dead || this.finished) return;
        if (Phaser.Input.Keyboard.JustDown(this.R)) {
            this.scene.restartScene();
        }
        if (this.jumping) {
            if (Phaser.Math.Between(1, 10) > 5)  new Particle(this.scene, this.x, this.y, 0xFFEAAB, 2, false)
            if (this.body.velocity.y >= 0) {
                this.anims.play("playerfall", true);
                this.body.setGravityY(1000)
                this.falling = true;
            }
        }
        //if (Phaser.Input.Keyboard.JustDown(this.down)) {
        if ((Phaser.Input.Keyboard.JustDown(this.cursor.up) || Phaser.Input.Keyboard.JustDown(this.W)) && this.body.blocked.down) {

            this.building = false;
            this.body.setVelocityY(this.jumpVelocity);
            this.body.setGravityY(600)
            this.anims.play("playerjump", true);
           // this.scene.playAudio("jump")
            this.jumping = true;
            this.jumpSmoke();

        } else if (this.body?.blocked.down && this.jumping) { 
            if (this.jumping) {this.scene.playAudio("land");this.landSmoke();}
            this.jumping = false;
            this.falling = false;
        } else if (this.cursor.right.isDown || this.D.isDown) {
            this.building = false;
            if (this.body.blocked.down) { this.anims.play("playerwalk", true); }
            this.right = true;
            this.flipX = (this.body.velocity.x < 0);
            this.body.setVelocityX(this.walkVelocity);

        } else if (this.cursor.left.isDown || this.A.isDown) {
            this.building = false;
            if (this.body.blocked.down) { this.anims.play("playerwalk", true); }
            this.right = false;
            this.flipX = true;
            this.body.setVelocityX(-this.walkVelocity);  

        } else {
            this.body?.setVelocityX(0)
            if (!this.casting) this.anims?.play("playeridle", true);
        }


        if (Phaser.Input.Keyboard.JustDown(this.cursor.down) || Phaser.Input.Keyboard.JustDown(this.S)) {

        }
    }

    landSmoke () {
        this.jumpSmoke(20);
    }

    jumpSmoke (offsetY = 10, varX) {
        Array(Phaser.Math.Between(3, 6)).fill(0).forEach(i => {
            const offset = varX || Phaser.Math.Between(-1, 1) > 0 ? 1 : -1;
            varX = varX || Phaser.Math.Between(0, 20);
            new JumpSmoke(this.scene, this.x + (offset * varX), this.y + offsetY)
        })
    }
    

    hitSmoke (offsetY = -32, offsetX) {
        Array(Phaser.Math.Between(8, 14)).fill(0).forEach(i => {
            const varX = Phaser.Math.Between(-10, 10);
            new JumpSmoke(this.scene, this.x + (offsetX + varX), this.y + offsetY)
        })
    }

    turn () {
        this.right = !this.right;
    }

    animationComplete (animation, frame) {
        if (animation.key === "playerground") {
            this.anims.play("playeridle", true)
        }

        if (animation.key === "playerspell") {
            this.anims.play("playeridle", true)
            this.casting = false;
        }
    }

    animationUpdate (animation, frame) {
        if(animation.key === "playerwalk") {
            this.scene.playRandom("step", Phaser.Math.Between(2, 7) / 10);
            new JumpSmoke(this.scene, this.x, this.y + Phaser.Math.Between(10, 15))
        }
    }

    hitFloor() {
        if (this.jumping) {
            ////this.scene.playAudio("ground")

            this.jumping = false;
        }
    }

    die () {
        this.dead = true;
        this.anims.play("playerdead", true);
        //this.body.immovable = true;
        this.body.moves = false;
        this.scene.time.delayedCall(2000, () => this.scene.restartScene(), null, this);
    }


    flashPlayer () {
        this.scene.tweens.add({
            targets: this,
            duration: 100,
            alpha: { from: 0.0, to: 1},
            repeat: 10,
            onComplete: () => {
                this.flashing = false;
            }
        });
    }

}

export default Player;
  