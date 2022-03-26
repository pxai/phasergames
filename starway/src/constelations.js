export default class Constelations {
    constructor (scene) {
        this.scene = scene;
    }

    generate(points) {
        this.generateConstellation(points);
        this.generateNoise(points * 2);
    }

    generateConstellation(points) {
        this.stars = [];
        this.edges = [];

        this.stars.push(this.generateStar());
        Array(points - 1).fill(0).forEach((_, i) => {
            const previous = this.stars[i];
            const current = this.generateDistancedStar(previous);
            this.edges.push(current.distances)
            this.stars.push(current);
        })
    }

    generateStar() {
        return {
            ...this.generateShape(),
            x: Phaser.Math.Between(32, 600 - 32),
            y: Phaser.Math.Between(32, 600 - 32)
        }
    }

    generateDistancedStar(start) {
        console.log("Generate against: ", start.x, start.y, Phaser.Math.Between(0, 100)/100)
        const distances = [10, 20, 30, 40, 50, 60, 70, 90, 100];
        const distance = Phaser.Math.RND.pick(distances);
        const circle = new Phaser.Geom.Circle(start.x, start.y, distance)
        const star = Phaser.Geom.Circle.GetPoint(circle, Phaser.Math.Between(0, 100) / 100);
        console.log("Generated point: ", star)
        const {x, y} = star;

        return {
            ...this.generateShape(),
            distance,
            x,
            y
        }
    }

    generateShape () {
        const shapes = ["star0", "star1", "star2"];

        return {
            sprite: Phaser.Math.RND.pick(shapes),
            scale: Phaser.Math.Between(0.8, 1.5)
        }
    }

    generateNoise (points) {
        Array(points).fill(0).forEach((_, i) => {
            this.stars.push(this.generateStar());
        })
    }
}