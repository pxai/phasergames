import Fart from "./objects/fart";
import FartAttack from "./objects/fart_attack";

export default class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name, green, red) {
        super(scene, x, y, name);
        this.startX = x;
        this.startY = y;
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.defaultJumpVelocity = 200;
        this.greenBeans = green;
        this.redBeans = red;
        this.init();
        this.right = 1;
        this.enableAttackFart = true;
    }

    init () {
        // this.body.setBounce(0.2);
        this.body.setCollideWorldBounds(true);
        this.setOrigin(0.5);

        this.scene.anims.create({
            key: "idle",
            frames: this.scene.anims.generateFrameNumbers("aki", { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.anims.create({
            key: "fartjump",
            frames: this.scene.anims.generateFrameNumbers("aki", { start: 2, end: 3 }),
            frameRate: 10
        });

        this.scene.anims.create({
            key: "left",
            frames: this.scene.anims.generateFrameNumbers("aki", { start: 6, end: 9 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: "turn",
            frames: [{ key: "aki", frame: 0 }],
            frameRate: 20
        });

        this.crouchAnimation = this.scene.anims.create({
            key: "crouch",
            frames: this.scene.anims.generateFrameNumbers("aki", { start: 2, end: 3 }),
            frameRate: 10
        });

        this.scene.anims.create({
            key: "right",
            frames: this.scene.anims.generateFrameNumbers("aki", { start: 6, end: 9 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: "jump",
            frames: this.scene.anims.generateFrameNumbers("aki", { start: 2, end: 5 }),
            frameRate: 5
        });

    }

    update () {
        if (this.body.velocity.y > 0 && !this.body.onFloor()) {
            this.scene.setPlayerCollider();
        }
        if (this.scene.cursors.left.isDown) {
            this.body.setVelocityX(-160);
            if (!this.scene.cursors.up.isDown)
                this.anims.play("left", true);
            this.flipX = (this.body.velocity.x < 0);
            this.right = -1;
        } else if (this.scene.cursors.right.isDown) {
            this.body.setVelocityX(160);
            if (!this.scene.cursors.up.isDown)
                this.anims.play("right", true);
            this.flipX = (this.body.velocity.x < 0);
            this.right = 1;
        } else if (this.scene.cursors.down.isDown && this.enableAttackFart) {
            this.enableAttackFart = false;
            this.anims.play("crouch", true);
            let x = this.right > 0 ? this.body.x - 5 : this.body.x + 40;
            let fart;
            if (this.redBeans > 0) {
                console.log("Fartack ", this.right,this.body.x, x)
                fart = new FartAttack(this.scene, x, this.body.y + 20, 1.8, this.right,0x964b00);
                this.useRedBean();
                this.scene.playFart(1.5);
                this.scene.setCollidersWithFoes(fart, "red");
            } else {
                console.log("Fartack ", this.right,this.body.x, x)
                fart = new FartAttack(this.scene, x, this.body.y + 20, 1, this.right);
                this.scene.setCollidersWithFoes(fart, "normal");
                this.scene.playFart();
            }

            setTimeout(() => this.afterCrouch(), 500)

        } else {
            this.body.setVelocityX(0);
            if (this.body.blocked.down && this.enableAttackFart)
                this.anims.play("idle", true);
        }


        if (this.scene.cursors.up.isDown && this.body.blocked.down) {
            this.scene.removePlayerCollider();
            this.anims.play("jump", true);
            if (this.greenBeans > 0) {
                new Fart(this.scene, this.body.x + 25, this.body.y + 20, 2);
                this.body.setVelocityY(-this.defaultJumpVelocity - 100);
                this.useGreenBean();
                this.scene.playFart(1);
            } else {
                new Fart(this.scene, this.body.x + 25, this.body.y + 20);
                this.body.setVelocityY(-this.defaultJumpVelocity);
                this.scene.playFart();
            }
        }
    }

    afterCrouch () {
        this.anims.play(this.right > 0 ? "right" : "left", true)
        this.enableAttackFart = true;
    }

    finish () {
        this.anims.play("turn", true);
        this.body.stop();
        console.log("Player was finished!");
    }

    restart () {
      this.x = this.startX;
      this.y = this.startY;
        this.anims.play("turn", true)
    }

     addGreenBean () {
        this.greenBeans++;
        this.scene.updateScore(20);
        this.scene.updateGreenBeans(this.greenBeans);
      }

      useGreenBean () {
        this.greenBeans--;
        this.scene.updateGreenBeans(this.greenBeans);
      }

      addRedBean () {
        this.redBeans++;
        this.scene.updateScore(50);
        this.scene.updateRedBeans(this.redBeans);
      }

      useRedBean () {
        this.redBeans--;
        this.scene.updateRedBeans(this.redBeans);
      }
}
