import Block from "./block"
import Fireball from "./fireball";

export default class FiringBlock extends Block {
    constructor(scene, x, y, name = 0) {
        super(scene, x, y , name);
        this.scene.events.on("update", this.update, this);
    }

    update () {
        super.update();

        if (Phaser.Math.Between(0, 500) > 499) {
            this.directShot()
        }
    }

    directShot() {
        const distance = Phaser.Math.Distance.BetweenPoints(this.scene.player, this);
        const fireball = new Fireball(this.scene, this.x + 16, this.y + 16, 0)
        this.scene.fireballs.add(fireball)
        this.scene.physics.moveTo(fireball, this.scene.player.x, this.scene.player.y, 100);
    }
}
