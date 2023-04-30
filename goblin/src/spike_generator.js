import Spike from "./spike";

export default class SpikeGenerator {
    constructor(scene){
        this.scene = scene;
        this.stopped = false;
        this.scene.events.on("update", this.update, this);
        this.generate();
    }

    generate () {
        this.addSpike();
        this.timer = this.scene.time.addEvent({ delay: Phaser.Math.Between(2000, 10000), callback: this.addSpike, callbackScope: this, loop: true });
    }

    stop () {
        this.timer.remove();
        this.stopped = true;
    }

    addSpike (x = 800, y) {
        const spike = new Spike(this.scene, this.scene.width, this.scene.height -128, "spike", 0, false);
        spike.body.setVelocityX(-200)
        console.log("Spike go!", spike)
        this.scene.spikes.add(spike);
    }

    update () {

    }
}