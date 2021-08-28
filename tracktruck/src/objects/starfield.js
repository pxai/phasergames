import Star from "./star";

export default class Starfield {
    constructor(scene){
        this.scene = scene;
        this.starfield = this.scene.add.layer();
    }

    generate () {
        this.stars = [];
        this.stopped = false;
        this.generateInitial();
        this.generationIntervalId = setInterval(() => this.add(), 100)
    }

    stop () {
        clearInterval(this.generationIntervalId);
        this.stopped = true;
    }

    generateInitial () {
        for (let i = 0; i < 32; i++) {
            this.add(Phaser.Math.Between(100, 1600));
        }
    }

    add (x = 800) {
        const star = new Star(this.scene, x);
        this.starfield.add(star);
        this.stars.push(star);
    }

    update () {
       this.stars.forEach( star => {
           if (star.x < 0) star.destroy();
           if (star.active && !this.stopped) star.x -= star.scale/2;
       }) 
       this.stars = this.stars.filter(star => star.active);
    }
}