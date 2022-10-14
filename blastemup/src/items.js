import Asteroid from "./asteroid";
import Energy from "./energy";

const available = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39];
export default class Items {
    constructor (scene, gridSize = 40, dificulty = 0) {
        this.scene = scene;
        this.generate(gridSize);
    }

    generate (gridSize) {
        this.grid = Array(gridSize * 64).fill(0).map(i => Array((gridSize - 7) * 64).fill(0));
        Array(40).fill(0).forEach(i => {
            let posx = Phaser.Math.Between(0, available.length-1)
            let posy = Phaser.Math.Between(0, available.length-1)
            let x = available[posx]
            let y = available[posy]
            let offset = y % 2 === 0 ?  32 : 0; 

            let asteroid = new Asteroid(this.scene, (x * 64) + offset, y * 55);
            this.addAsteroid2Grid(x, y, gridSize)
            this.scene.asteroids.add(asteroid)
            return asteroid;
        })

        this.energies = Array(20).fill(0).map(i => {
            let x = Phaser.Math.Between(0, 40)
            let y = Phaser.Math.Between(0, 40)
            let offset = y % 2 === 0 ?  32 : 0; 
            let energy = new Energy(this.scene, (x * 64) + offset, y * 55);
            this.scene.energies.add(energy)
            return energy;
        })
    }

    addAsteroid2Grid (x, y, gridSize) {
        Array(64).fill(0).forEach((_,i) => {
            Array(64).fill(0).forEach((_, j) => {
                if (x + i < gridSize * 64 && y + j < (gridSize - 7) * 64)
                    this.grid[x + i][y + j] = 1;
            });
        });
    }
}