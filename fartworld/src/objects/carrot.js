import Foe from './foe';

export default class Carrot extends Foe {
    constructor ({ scene, platforms, x, y, name }) {
        super({scene, x, y, name: "carrot"});
        this.platforms = platforms;
        this.hiding = false;
        this.appearing = false;
    }

    init() {
        super.init();
        this.scene.anims.create({
            key: "hide" + this.name,
            frames: this.scene.anims.generateFrameNumbers(this.name, { start: 5, end: 14 }),
            frameRate: 10,
        });
    }

    update () {
        if (this.body && !this.dead && !this.hiding && !this.appearing) {
            if (this.body.onFloor()) {
                this.play("walk" + this.name, true);
                this.platformLimitsCollider.active = true;
                this.platformCollider.active = true; 
                if (Phaser.Math.Between(1,101) > 100) {
                    this.hiding = true;
                    this.body.setVelocityX(0);
                    this.play("hide" + this.name, true );
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
        console.log("Oh I hit the ground a carrot!! ", this);
        this.dead = true;
        this.body.enable = false; 
        this.scene.updateScore(1000);
        this.animate("death")
    }

    animationComplete(animation, frame) {
        super.animationComplete(animation, frame)
        if (animation.key ===  "hidecarrot") {
            if (this.hiding) {
                console.log("Animation complete: ", this.scene)
                this.hiding = false;
                this.appearing = true;
                this.scene.time.delayedCall(Phaser.Math.Between(2000, 4000), this.reappear, null, this); 
             } else if (this.appearing) {
                this.appearing = false;
                this.body.setVelocityX(100);
            }
        }
    }

    reappear () {
        const platform = this.platforms[Phaser.Math.Between(0, this.platforms.length-1)];
        this.setPosition(platform.x + 10, platform.y - 32);
        this.playReverse("hide" + this.name, true );
    }
}
