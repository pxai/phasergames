import Water from "./water";
import Block from "./block";

export default class WaterPlatform {
    constructor (scene) {
        this.scene = scene;
        this.wallGrow = 16;
        this.init();
    }

    init() {
        for (let i = 0; i < 30; i++) {
            this.scene.water.add(new Water(this.scene, 64 * (i - 15), 64))
        }
        this.sea = this.scene.add.rectangle(0, 576, 1800, 1000, 0x2f4f59).setOrigin(0.5);
        this.timer = this.scene.time.addEvent({ delay: 3000, callback: this.grow, callbackScope: this, loop: true });
    }

    grow () {
        this.scene.water.children.entries.forEach((water) => { water.y -= 64 });
        this.sea.y -= 64;
        this.growTiles();

    }

    growTiles () {
        console.log("Growing tiles!")
        for (let i = 0; i < 16; i++) {
            this.scene.platform.add(new Block(this.scene, -7 * 64, this.wallGrow * -64, Phaser.Math.Between(0, 1)))
            this.scene.platform.add(new Block(this.scene, 7 * 64, this.wallGrow * -64, Phaser.Math.Between(0, 1)))
            this.wallGrow++;
        }
    }
}