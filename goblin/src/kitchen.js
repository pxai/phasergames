import Muffin from "./muffin";

export default class Kitchen {
    constructor(scene){
        this.scene = scene;
        this.stopped = false;
        this.scene.events.on("update", this.update, this);
        this.generate();
    }

    generate () {
        this.addMuffin();
        this.timer = this.scene.time.addEvent({ delay: Phaser.Math.Between(1000, 6000), callback: this.addMuffin, callbackScope: this, loop: true });
    }

    stop () {
        this.timer.remove();
        this.stopped = true;
    }

    addMuffin (x = 800, y) {

        const muffin = new Muffin(this.scene, this.scene.width, this.scene.height - 300);

        this.scene.muffins.add(muffin);
    }

    update () {

    }
}