import Cloud from "./cloud";

export default class Sky {
    constructor(scene){
        this.scene = scene;
        this.pregenerate();
        this.generate();
    }

    pregenerate() {
        this.clouds = [];
        this.stopped = false;
        this.scene.events.on("update", this.update, this);
        Array(Phaser.Math.Between(10, 15)).fill(0).forEach(i => {
            this.addCloud(Phaser.Math.Between(10, 700))
        })
    }

    generate () {
        this.addCloud();
        this.timer = this.scene.time.addEvent({ delay: 4000, callback: this.addCloud, callbackScope: this, loop: true });
    }

    stop () {
        this.timer.remove();
        this.stopped = true;
    }

    addCloud (x = 800, y) {
        const cloud = new Cloud(this.scene, x, Phaser.Math.Between(10, 700));
        this.scene.cloudLayer.add(cloud);
        this.clouds.push(cloud);
    }

    update () {
       this.clouds.forEach( cloud => {
           if (cloud.x < 0) cloud.destroy();
           if (cloud.active && !this.stopped) cloud.x -= cloud.scale/2;
       }) 
       this.clouds = this.clouds.filter(cloud => cloud.active);
    }
}