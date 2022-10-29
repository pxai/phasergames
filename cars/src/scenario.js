export default class Scenario {
    constructor(scene) {
        this.scene = scene;
        this.init();
    }

    init() {
        Array(Math.round(800 / 64)).fill(0).forEach((_, i) => {
            this.green(i, 0);
            this.road(i, 4  * 64, 0, 6)
            this.green(i, (4 * 64) + (6 * 64));
        })
    }

    road(x , y, tile = 0, height = 4, start = 0) {
        Array(height).fill(0).forEach((_, i)  => {
            console.log("Road: ", y + (64 * i))
            this.scene.add.sprite(x * 64, y + (64 * i), "scenario64", tile)
        })
    }

    green(x, y, height = 4, start = 0) {
        Array(height).fill(0).forEach((_, i) => {
            console.log("Green: ", y + (64 * i))
            this.scene.add.sprite(x * 64, y + (64 * i), "scenario64", 4)
        })
    }

    generate () {
        this.scene.add.sprite(0, 0, "scenario64",4)
        this.scene.add.sprite(0, 64, "scenario64",5)
        this.scene.add.sprite(0, 128, "scenario64",4)
        this.scene.add.sprite(0, 64 * 3, "scenario64",0)
        this.scene.add.sprite(0, 64 * 4, "scenario64",0)
        this.scene.add.sprite(0, 64 * 5, "scenario64",0)
        this.scene.add.sprite(0, 64 * 6, "scenario64",4)
        this.scene.add.sprite(0, 64 * 7, "scenario64",5)
        this.scene.add.sprite(0, 64 * 8, "scenario64",4)
    }
}