import Spike from "./spike";
import Bat from "./bat";

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
        this.batTimer = this.scene.time.addEvent({ delay: Phaser.Math.Between(10000, 20000), callback: this.addBat, callbackScope: this, loop: true });

    }

    stop () {
        this.timer.remove();
        this.batTimer.remove();
        this.stopped = true;
    }

    addSpike (x = 800, y) {
        const spike = new Spike(this.scene, this.scene.width, this.scene.height -128, "spike", 0, false);
        spike.body.setVelocityX(-200)

        this.scene.spikes.add(spike);
    }

    addBat (x = 800, y) {
        const direction = Phaser.Math.RND.pick(["right", "left"]);
        const startX = (direction === "left") ?  -64 : this.scene.width + 32;
        const bat = new Bat(this.scene, startX, Phaser.Math.Between(this.scene.height - 100, this.scene.height - 250), "spike", direction);

        console.log("Bat go!", bat.x, bat.y)
        this.scene.batGroup.add(bat);
    }

    update () {

    }
}