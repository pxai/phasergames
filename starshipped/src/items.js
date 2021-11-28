import Asteroid from "./asteroid";
import Energy from "./energy";

export default class Items {
    constructor (scene, gridSize = 40, dificulty = 0) {
        this.scene = scene;
        this.generate(gridSize);
    }

    generate (gridSize) {
        this.grid = Array(gridSize * 64).fill(0).map(i => Array((gridSize - 7) * 64).fill(0));
        Array(40).fill(0).forEach(i => {
            let x = Phaser.Math.Between(0, 39)
            let y = Phaser.Math.Between(0, 39)
            let offset = y % 2 === 0 ?  32 : 0; 
            //this.grid[x][y] = 1;
            let asteroid = new Asteroid(this.scene, (x * 64) + offset, y * 55);
            this.scene.asteroids.add(asteroid)
            return asteroid;
        })

       // console.log(this.grid)

        this.energies = Array(15).fill(0).map(i => {
            let x = Phaser.Math.Between(0, 40)
            let y = Phaser.Math.Between(0, 40)
            let offset = y % 2 === 0 ?  32 : 0; 
            let energy = new Energy(this.scene, (x * 64) + offset, y * 55);
            this.scene.energies.add(energy)
            return energy;
        })
    }
}