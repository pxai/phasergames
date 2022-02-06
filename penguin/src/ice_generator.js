import Ice from "./ice";

export default class IceGenerator {
    constructor(scene) {
        this.scene = scene;
    }

    generate () {
        this.scene.time.delayedCall(500, () => this.addIce(), null, this)
    }

    addIce () {
        let x = Phaser.Math.Between(-150, 150)
        x = x - this.scene.player.x > 320 ? Phaser.Math.Between(-10, 10) : x;
        const y = this.scene.player.y - Phaser.Math.Between(60, 75)
        const ice = new Ice(this.scene, x, y, this.scene.icesLayer);
        this.scene.ice.add(ice)
    }
}