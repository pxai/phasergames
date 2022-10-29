import Foe from "./foe";

export default class FoeGenerator {
    constructor (scene) {
        this.scene = scene;
        this.init();
    }

    init () {
        this.scene.time.delayedCall(Phaser.Math.Between(2000, 3000), () => { this.generate() }, null, this);
    }

    generate() {
        this.scene.foes.add(new Foe(this.scene, this.scene.player.x + 600, this.scene.player.y + Phaser.Math.Between(-100, 100)))
        this.init();
    }
}
