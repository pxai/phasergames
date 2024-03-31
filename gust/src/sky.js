import Cloud from "./cloud";

export default class Sky {
    constructor(scene, player = null){
        this.scene = scene;
        this.player = player;
        this.pregenerate();
        this.generate();
    }

    pregenerate() {
        this.clouds = [];
        this.stopped = false;
        this.scene.events.on("update", this.update, this);
        Array(Phaser.Math.Between(10, 15)).fill(0).forEach(i => {
            this.addCloud(800, Phaser.Math.Between(10, 700))
        })
    }

    generate () {
        this.timer = this.scene.time.addEvent({ delay: 400, callback: this.addCloud, callbackScope: this, loop: true });
    }

    stop () {
        this.timer.remove();
        this.stopped = true;
    }

    addCloud (x = 800, y) {
        if (this.player) {
            console.log("generate  ", this.player.y)

            x = 800
            y = this.player.y + Phaser.Math.Between(-300, 300)
        }
        const cloud = new Cloud(this.scene, x, y);
        this.scene.cloudLayer.add(cloud);
        this.clouds.push(cloud);
    }

    update () {
       this.clouds.forEach( cloud => {
           if (cloud.x < 0) cloud.destroy();
           if (cloud.active && !this.stopped) cloud.x -= cloud.scale * 0.2;
       })
       this.clouds = this.clouds.filter(cloud => cloud.active);
    }
}