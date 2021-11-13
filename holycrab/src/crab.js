import Dust from "./dust";

class Crab extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, name = "crab") {
        super(scene, x, y, name);
        this.scene = scene;
        this.setOrigin(0.5);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.jumping = false;
        this.right = true;
        this.init();
    }

    init () {
        this.scene.anims.create({
            key: "crabjump",
            frames: this.scene.anims.generateFrameNumbers("crab", { start: 0, end: 0 }),
            frameRate: 5,
            repeat: -1
        });
        this.scene.anims.create({
            key: "crabfall",
            frames: this.scene.anims.generateFrameNumbers("crab", { start: 1, end: 1 }),
            frameRate: 5,
            repeat: -1
        });
        this.scene.anims.create({
            key: "crabhit",
            frames: this.scene.anims.generateFrameNumbers("crab", { start: 2, end: 2 }),
            frameRate: 1,
            repeat: 1
        });
        this.anims.play("crabfall", true);
        this.on('animationcomplete', this.animationComplete, this);
    }

    update () {
        if (this.body.blocked.down) {
            this.anims.play("crabhit", true);
        } else if (this.body.velocity.y < 0) {
            this.anims.play("crabjump", true);
        } else {
            this.anims.play("crabfall", true)
        }
    }

    hitShell (shell) {
        console.log(this.body.speed)
        this.body.setVelocityY(this.body.speed > 330 ? -330 : -this.body.speed);
        new Dust(this.scene, this.x, this.y, "0xede46e")
    }

    hitGround () {
        this.body.setVelocityY(-330);
        new Dust(this.scene, this.x, this.y, "0x902406")
    }

    redirect(velocityX) {
        this.body.setVelocityX(velocityX);
    }

    animationComplete(animation, frame) {
        if (animation.key === "crabhit") {
            console.log("Change:");
            this.anims.play("crabjump", true)
        }
    }
}

export default Crab;