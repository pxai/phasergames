import Water from "./water";
import Little from "./little";
import Block from "./block";

export default class WaterPlatform {
    constructor (scene) {
        this.scene = scene;
        this.wallGrow = 16;
        this.init();
    }

    init() {
        for (let i = 0; i < 30; i++) {
            this.scene.water.add(new Water(this.scene, 64 * (i - 15), 128))
        }
        this.sea = this.scene.add.rectangle(0, 650, 1800, 1000, 0x2f4f59).setOrigin(0.5);
        this.timer = this.scene.time.addEvent({ delay: 900, callback: this.grow, callbackScope: this, loop: true });
    }

    grow () {
        this.scene.water.children.entries.forEach((water) => { water.y -= 64 });
        this.sea.y -= 64;
    }

    goBack () {
        this.scene.water.children.entries.forEach((water) => { water.y += 128 });
        this.sea.y += 128;
    }

    growTiles () {
        for (let i = 0; i < 4; i++) {
            this.scene.platform.add(new Block(this.scene, -7 * 64, this.wallGrow * -64, Phaser.Math.Between(0, 1)))
            this.scene.platform.add(new Block(this.scene, 7 * 64, this.wallGrow * -64, Phaser.Math.Between(0, 1)))
            this.wallGrow++;
        }

        if (Phaser.Math.Between(0, 3) > 1) {
            const position = Math.random() > 0.5 ? 1 : -1;
            this.scene.littles.add(new Little(this.scene, ((position * 7) * 64) + (64 * -position), this.wallGrow * -128))
            this.scene.platform.add(new Block(this.scene, ((position * 7) * 64) + (64 * -position), this.wallGrow * -64))
        }
    }

    removeOldTiles () {
        console.log("Before clean: ", this.scene.platform.children.entries.length)
        this.scene.platform.children.entries.slice(0, 6).forEach( block => {
            this.scene.platform.remove(block, true, true)
        })
        console.log("After clean: ", this.scene.platform.children.entries.length)
    }
}