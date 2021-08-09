import Foe from './foe';

export default class GreenPepper extends Foe {
    constructor ({ scene, x, y, name }) {
        super({scene, x, y, name: "greenpepper"});
    }

    update () {
        if (this.body) {
            if (this.body.onFloor()) {
                this.play("walk" + this.name, true);
                this.platformLimitsCollider.active = true;
                this.platformCollider.active = true; 
                if (Phaser.Math.Between(1,101) > 100)
                    this.body.setVelocityY(-300);
            } else {
                this.play("fall" + this.name, true);
                this.platformLimitsCollider.active = false;
                this.platformCollider.active = this.body.velocity.y > 0;
            }
            this.flipX = (this.body.velocity.x > 0);
        }
    }
}
