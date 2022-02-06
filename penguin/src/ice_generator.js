import Ice from "./ice";

export default class IceGenerator {
    constructor(scene) {
        this.scene = scene;
    }

    generate () {
        this.scene.time.delayedCall(500, () => this.addIce(), null, this)
    }

    addIce () {
        console.log("Generating ice!")
        let x = Phaser.Math.Between(-150, 150)
        //let sign = x >= 0 ? 1 : -1; 
        //x = Math.abs(x) < 340 ? x : 340 * sign; 
        console.log("Final x:" , this.scene.player.x, this.scene.player.y)
        const y = this.scene.player.y - Phaser.Math.Between(60, 80)
        this.scene.ice.add(new Ice(this.scene, x, y))
    }
}