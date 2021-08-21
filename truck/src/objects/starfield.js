import Star from "./star";

export default class Starfield {
    constructor(scene){
        this.scene = scene;
        this.starfield = this.scene.add.layer();
        this.stars = [];
    }

    generate () {
        setInterval(() => this.add(), 500)
    }

    add () {
        const star = new Star(this.scene);
        this.starfield.add(star);
        this.stars.push(star);
    }

    update () {
       this.stars.forEach( star => {
           if (star.x < 0) star.destroy();
           if (star.active) star.x -= star.scale/2;
       }) 
       this.stars = this.stars.filter(star => star.active);
    }
}