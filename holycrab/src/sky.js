import Cloud from "./cloud";

export default class Sky {
    constructor(scene){
        this.scene = scene;
        this.cloudLayer = this.scene.add.layer();
        this.generate();
    }

    generate () {
        this.clouds = [];
        this.stopped = false;

        this.timer = this.scene.time.addEvent({ delay: 2000, callback: this.addCloud, callbackScope: this, loop: true });
    }

    stop () {
        this.timer.remove();
        this.stopped = true;
    }

    addCloud (x = 1200) {
        const cloud = new Cloud(this.scene, this.scene.crab.x + 700, this.scene.crab.y);
        this.cloudLayer.add(cloud);
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