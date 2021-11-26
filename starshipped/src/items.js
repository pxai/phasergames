import Asteroid from "./asteroid";

export default class Items {
    constructor (scene, dificulty = 0) {
        this.scene = scene;
        this.generate();
    }

    generate () {
        this.positions = Array(10).fill(0).map(i => {
            let x = Phaser.Math.Between(0, 20)
            let y = Phaser.Math.Between(0, 20)
            let offset = y % 2 === 0 ?  32 : 0; 
            let asteroid = new Asteroid(this.scene, (x * 64) + offset, y * 55);
            this.scene.asteroids.add(asteroid)
            return asteroid;
        })
    }
}