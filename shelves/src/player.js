
import { JumpSmoke, RockSmoke } from "./particle";

class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y, "willie")
        this.setOrigin(0.5)
        this.scene = scene;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.cursor = this.scene.input.keyboard.createCursorKeys();
        this.down = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.right = true;
        //this.body.setGravityY(100)
        this.body.setSize(20, 30)
        this.init();
        this.jumping = false;
        this.flashing = false;
        this.falling = false;
        this.finished = false;
        this.walkVelocity = 200;
        this.jumpVelocity = -400;
        this.health = 10;

        this.dead = false;

        this.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.scene.events.on("update", this.update, this);
    }

    init () {

        this.scene.anims.create({
            key: "startidle",
            frames: this.scene.anims.generateFrameNumbers("willie", { start: 0, end: 1 }),
            frameRate: 3,
            repeat: -1
        });

        this.scene.anims.create({
            key: "playeridle",
            frames: this.scene.anims.generateFrameNumbers("willie", { start: 2, end: 3 }),
            frameRate: 3,
            repeat: -1
        });

        this.scene.anims.create({
            key: "playerwalk",
            frames: this.scene.anims.generateFrameNumbers("willie", { start: 4, end: 6 }),
            frameRate: 10,
        });

        this.scene.anims.create({
            key: "playerjump",
            frames: this.scene.anims.generateFrameNumbers("willie", { start: 4, end: 4 }),
            frameRate: 1,
        });

        this.scene.anims.create({
            key: "playerhammer",
            frames: this.scene.anims.generateFrameNumbers("willie", { start: 7, end: 8 }),
            frameRate: 10
        });

        this.scene.anims.create({
            key: "playerbuild",
            frames: this.scene.anims.generateFrameNumbers("willie", { start: 9, end: 10 }),
            frameRate: 10,
            repeat: 2
        });

        this.scene.anims.create({
            key: "playerdead",
            frames: this.scene.anims.generateFrameNumbers("willie", { start: 11, end: 16 }),
            frameRate: 5,
        });

        this.anims.play("startidle", true);

        this.on('animationcomplete', this.animationComplete, this);
        this.on('animationupdate', this.animationUpdate, this);
    }    

    update () {
        if (this.dead || this.finished) return;
        if (this.jumping) {
            // if (Phaser.Math.Between(1,101) > 100) new Star(this.scene, this.x, this.y + 5)
            if (this.body.velocity.y >= 0) {
                this.body.setGravityY(900)
                this.body.setDragY(-200)
                this.falling = true;
            }
        }
        //if (Phaser.Input.Keyboard.JustDown(this.down)) {
        if ((Phaser.Input.Keyboard.JustDown(this.spaceBar) || Phaser.Input.Keyboard.JustDown(this.cursor.up) || Phaser.Input.Keyboard.JustDown(this.W)) && this.body.blocked.down) {
            // new Dust(this.scene, this.x, this.y)
            this.building = false;
            this.body.setDragY(200)
            this.body.setVelocityY(this.jumpVelocity);
            this.body.setGravityY(400)

            this.anims.play("playerjump", true);
            this.scene.playAudio("jump")
            this.jumping = true;
            this.jumpSmoke();

        } else if (this.body.blocked.down && this.jumping) { 
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
            this.body.setVelocityX(0)
            this.anims.play("playeridle", true);
        }


        if (Phaser.Input.Keyboard.JustDown(this.cursor.down) || Phaser.Input.Keyboard.JustDown(this.S)) {
          /*  if (this.scene.tnts.countActive(true) < this.totalTNTs) {
                this.scene.tnts.add(new TNT(this.scene, this.x, this.y));
            }*/ 
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

        if(animation.key == "playerwalk") {
            this.scene.playRandom("step", Phaser.Math.Between(2, 7) / 10);
            new JumpSmoke(this.scene, this.x, this.y + 10)
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

    hit () {
        this.scene.updateHealth(-1)
        this.scene.showPoints(this.x, this.y, "-1 HEALTH", 0xff0000)
        this.flashing = true;
        console.log("Player was hit: ", this.scene.registry.get("health"))
        this.flashPlayer();
        if (+this.scene.registry.get("health") < 0) {
            console.log("Player dies")
            this.die();
        }

    }

    die () {
        this.dead = true;
        this.anims.play("playerdead", true);
        this.body.immovable = true;
        this.body.moves = false;
        this.scene.finishScene("outro");
    }


    applyPrize (prize) {
        this.scene.playAudio("yee-haw");
        switch (prize) {
        case "tnt":
            this.totalTNTs++;
            this.scene.updateTNT(1);
            this.scene.showPoints(this.x, this.y, "+1 TNT")
            this.flashPlayer();
            break;
        case "whisky":
            let health = Phaser.Math.Between(4, 8);
            this.scene.updateHealth(health) 
            this.scene.showPoints(this.x, this.y, "+" + health + " HEALTH")
            this.flashPlayer();
            break;
        case "gold":
            let gold = Phaser.Math.Between(20, 30);
            this.scene.showPoints(this.x, this.y, "+" + gold + " GOLD")
            this.scene.updateScore(gold);
            break;
        case "boots":
            this.scene.showPoints(this.x, this.y, "+ SPEED")
            this.walkVelocity += 50;
            this.scene.registry.set("velocity", this.walkVelocity)
            break;
        case "remote":
            this.scene.showPoints(this.x, this.y, "+ SPACE = DETONATION")
            this.scene.registry.set("remote", "1")
            this.remoteActive = true;
            break;
        default: break;
        }
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
  