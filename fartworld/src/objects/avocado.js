import Foe from './foe';

export default class Avocado extends Foe {
    constructor ({ scene, x, y, name }) {
        super({scene, x, y, name: "avocado"});
        this.shooting = false;
    }

    init() {
        super.init();
        this.scene.anims.create({
            key: "shoot" + this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 6, end: 9 }),
            frameRate: 10,
        });
    }

    update () {
        if (this.body && !this.dead && !this.shooting) {
            if (this.body.onFloor()) {
                this.play("walk" + this.name, true);
                this.platformLimitsCollider.active = true;
                this.platformCollider.active = true; 
                if (Phaser.Math.Between(1,101) > 100) {
                    let direction = this.body.velocity.x > 0 ? 1 : -1;
                    this.shooting = true;
                    this.body.setVelocityX(0);
                    this.play("shoot" + this.name, true );
                    this.flipX = (this.body.velocity.x > 0);
                    this.scene.shoot(this, direction);
                }
            } else {
                this.play("fall" + this.name, true);
                this.platformLimitsCollider.active = false;
                this.platformCollider.active = this.body.velocity.y > 0;
            }
            this.flipX = (this.body.velocity.x > 0);
        }
    }

    hitGround(ground, foe) {
        console.log("Oh I hit the ground a avocado!! ", this);
        this.dead = true;
        this.body.enable = false; 
        this.scene.updateScore(1000);
        this.animate("death")
    }

    animationComplete(animation, frame) {
        super.animationComplete(animation, frame)
        if (animation.key === "shootavocado") {
            console.log("Animation complete")
            this.shooting = false;
            this.body.setVelocityX(100);
        }
    }
}
