import Muffin from "./muffin";

export default class Kitchen {
    constructor(scene){
        this.scene = scene;
        this.pregenerate();
        this.generate();
    }

    pregenerate() {
        this.stopped = false;
        this.scene.events.on("update", this.update, this);
        Array(Phaser.Math.Between(10, 15)).fill(0).forEach(i => {
            this.addMuffin(Phaser.Math.Between(10, 700))
        })
    }

    generate () {
        this.addMuffin();
        this.timer = this.scene.time.addEvent({ delay: 4000, callback: this.addMuffin, callbackScope: this, loop: true });
    }

    stop () {
        this.timer.remove();
        this.stopped = true;
    }

    addMuffin (x = 800, y) {

        const muffin = new Muffin(this.scene, this.scene.width - 100, this.scene.height - 300);
        console.log("Muffin go!", muffin)
        this.scene.muffins.add(muffin);
    }

    update () {

    }
}