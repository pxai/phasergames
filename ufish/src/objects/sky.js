import Cloud from "./cloud";

export default class Sky {
    constructor(scene){
        this.scene = scene;
        this.background = this.scene.add.rectangle(0, 0, this.scene.width, this.scene.height, 0x55ddff).setOrigin(0)
        this.cloudLayer = this.scene.add.layer();
        this.generate();
    }

    generate () {
        this.clouds = [];
        this.stopped = false;

        this.generationIntervalId = setInterval(() => this.add(), 5000)
    }

    stop () {
        clearInterval(this.generationIntervalId);
        this.stopped = true;
    }

    add (x = 1200) {
        const cloud = new Cloud(this.scene, x);
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