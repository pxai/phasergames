import Marble from "./marble";

export default class Albat extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y, "albat");

        this.scene = scene;
        this.name = "albat";

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.overlap = this.scene.physics.add.overlap(this.scene.player, this, this.touch, null, this.scene);
        this.init();
        this.dead = false;
        this.fartCollider = 0;
        this.life = 10;
        this.attacking = false;
    }

    init () {
        this.body.setCollideWorldBounds(true);
        this.body.onWorldBounds = true;
        this.setOrigin(0.5);

        this.scene.anims.create({
            key: "fly" + this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name,{ start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });

        this.scene.anims.create({
            key: "attack" + this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 2, end: 3 }),
            frameRate: 20,
        });

        this.deathAnimation = this.scene.anims.create({
            key: "death" + this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 4, end: 10 }),
            frameRate: 5,
        });

        this.on('animationcomplete', this.animationComplete, this);

        this.body.setVelocityX(100);
        this.animate("fly")
    }

    update () {
       if (!this.dead) {
            if (!this.attacking) this.animate("fly")
            if (Phaser.Math.Between(1,501) > 500) {
                this.body.setVelocityX(-this.body.velocity.x);
            }

            if (Phaser.Math.Between(1,101) > 100) {
                console.log("GravitY");
                this.body.setAllowGravity(true);
                this.scene.time.delayedCall(Phaser.Math.Between(100, 400), this.upAgain, null, this); 
            }

            if (Phaser.Math.Between(1,801) > 800) {
                this.attack();
            }
       }
    }

    upAgain() {
        this.body.setVelocityY(-100);
        this.scene.time.delayedCall(Phaser.Math.Between(300, 400), () => this.body.setAllowGravity(false), null, this); 
    }

    attack () {
        this.attacking = true;
        this.animate("attack")
        new Marble(this.scene, this.x, this.y + 10, Phaser.Math.Between(1, 9))
    }

    animate (animation) {
        this.play(animation + this.name, true)
    }

    animationComplete(animation, frame) {
        if (animation.key.startsWith("death")) {
            console.log("Animation complete")
            this.death();
        }

        if (animation.key.startsWith("attack")) {
            console.log("Attack animation complete")
            this.attacking = false;
        }
    }

    touch (player, foe) {
        if (!player.dead) {
            console.log("Touched, player DEATH ", player, foe);
            player.scene.playerDeath(player);
        }
    }

    setFartCollider(collider) {
        this.fartCollider = collider;
    }

    farted(fart, foe, x) {
        console.log("Farted ", fart, foe, fart.tint, foe.body.speed);
        foe.fartCollider.active = false;
        fart.body.destroy();
        foe.body.setVelocityY(-100);
        foe.body.setVelocityX(-foe.body.velocity.x);
        foe.scene.updateScore(100);
    }

    redFarted (fart, foe) {   
        console.log("Red farted!! ", this);
        this.life--;
        if (this.life === 0) {
            this.animate("death");
            this.dead = true;
            this.body.enable = false; 
            this.scene.updateScore(5000); 
        }
    }


    death() {
        console.log("Im dead ", this, this.name);
        this.dead = true;
        this.destroy();
    }

    disable () {
        this.visible = false;
        this.overlap.active = false;
    }

    destroy() {
        super.destroy();
    }
}
