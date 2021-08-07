import Fart from "./objects/fart";

export default class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, name, green, red) {
        super(scene, x, y, name);
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.defaultJumpVelocity = 200;
        this.greenBeans = green;
        this.redBeans = red;
        this.init();
        this.right = 1;
    }

    init () {
        // this.body.setBounce(0.2);
        this.body.setCollideWorldBounds(true);
        this.setOrigin(0.5);

        this.scene.anims.create({
            key: "fartjump",
            frames: this.scene.anims.generateFrameNumbers("fart", { start: 0, end: 9 }),
            frameRate: 10
        });

        this.scene.anims.create({
            key: "left",
            frames: this.scene.anims.generateFrameNumbers("aki", { start: 1, end: 3 }),
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
            frames: [{ key: "aki", frame: 7 }],
            frameRate: 20
        });

        this.scene.anims.create({
            key: "right",
            frames: this.scene.anims.generateFrameNumbers("aki", { start: 4, end: 6 }),
            frameRate: 10,
            repeat: -1
        });

        this.scene.anims.create({
            key: "jump",
            frames: this.scene.anims.generateFrameNumbers("aki", { start: 7, end: 0 }),
            frameRate: 5
        });

    }

    update () {
        if (this.body.velocity.y > 0 && !this.body.onFloor()) {
            this.scene.setPlayerCollider();
        }
        if (this.scene.cursors.left.isDown) {
            this.body.setVelocityX(-160);
            this.anims.play("left", true);
            this.right = -1;
        } else if (this.scene.cursors.right.isDown) {
            this.body.setVelocityX(160);
            this.anims.play("right", true);
            this.right = 1;
        } else if (this.scene.cursors.down.isDown) {
            this.anims.play("crouch", true);
            if (this.redBeans > 0) {
                console.log("Fartack ", this.right)
                new Fart(this.scene, this.body.x - (20 * this.right), this.body.y + 40);
                this.useRedBean();
            } 
            setTimeout(() => this.anims.play(this.right > 0 ? "right" : "left", true), 500)

        } else {
            this.body.setVelocityX(0);
            this.anims.stop();
        }

        if (this.scene.cursors.up.isDown && this.body.blocked.down) {
            this.scene.removePlayerCollider();
            this.anims.stop();
            if (this.greenBeans > 0) {
                new Fart(this.scene, this.body.x + 25, this.body.y + 50);
                this.body.setVelocityY(-this.defaultJumpVelocity - 100);
                this.useGreenBean();
            } else {
                new Fart(this.scene, this.body.x + 25, this.body.y + 50);
                this.body.setVelocityY(-this.defaultJumpVelocity);
            }
        }
    }

     addGreenBean () {
        this.greenBeans++;
        this.scene.updateGreenBeans(this.greenBeans);
      } 
  
      useGreenBean () {
        this.greenBeans--;
        this.scene.updateGreenBeans(this.greenBeans);
      } 
  
      addRedBean () {
        this.redBeans++;
        this.scene.updateRedBeans(this.redBeans);
      } 
  
      useRedBean () {
        this.redBeans--;
        this.scene.updateRedBeans(this.redBeans);
      } 
}
