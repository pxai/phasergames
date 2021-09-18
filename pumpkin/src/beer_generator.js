import Beer from "./beer";

export default class BeerGenerator {
    constructor(scene) {
        this.scene = scene;
        this.beers = [];
    }

    generate() {
        const beer = new Beer(this.scene, 200, 200, "beer");
        this.beers.push(beer);
    }
}