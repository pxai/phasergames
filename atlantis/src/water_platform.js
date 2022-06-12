import Water from "./water";
import Bubble from "./bubble";

export default class WaterPlatform {
    constructor (scene) {
        this.scene = scene;
        this.wallGrow = 16;
        this.init();
    }

    init() {
        for (let i = 0; i < 30; i++) {
            this.scene.water.add(new Water(this.scene, 64 * (i - 15), 632))
        }
        this.sea = this.scene.add.rectangle(0, 1164, 1800, 1000, 0x2f4f59).setOrigin(0.5);
        this.timer = this.scene.time.addEvent({ delay: 900, callback: this.grow, callbackScope: this, loop: true });
    }

    grow () {
        this.scene.water.children.entries.forEach((water) => { water.y -= 2 });
        this.sea.y -= 2;
        if (Phaser.Math.Between(0, 3) > 2) this.generateBubble()
    }

    goBack () {
        this.scene.water.children.entries.forEach((water) => { water.y += 128 });
        this.sea.y += 128;
    }

    generateBubble () {
        console.log("Generate bubble")
        const bubble = new Bubble(this.scene, Phaser.Math.Between(10, 800), this.sea.y - 500);
        this.scene.bubbleLayer.add(bubble)
        this.scene.bubbles.add(bubble)
    }
}