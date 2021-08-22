import Asteroid from "./asteroid";

export default class AsteroidField {
    constructor(scene){
        this.scene = scene;
        this.asteroidsLayer = this.scene.add.layer();
        this.asteroids = [];
    }

    generate () {
        setInterval(() => this.add(), 2000)
    }

    add () {
        const added = new Asteroid(this.scene);
        this.asteroids.push(added);
        this.asteroids.forEach(asteroid => {
            this.scene.physics.add.collider(asteroid, added, added.asteroidHit, null, added);
            this.scene.containerGenerator.containers.forEach(container => {
              //  this.scene.physics.add.collider(asteroid, container, this.scene.player.asteroidHit, null, this.scene.player);
            })
        })
    }

    update () {
       this.asteroids.forEach( asteroid => {
           if (asteroid.x < 0) asteroid.destroy();
            if (asteroid.active) {
                asteroid.angle += 1/(5*asteroid.scale);
                asteroid.body.angle += 1/(5*asteroid.scale);
            }
       })
       this.asteroids = this.asteroids.filter(asteroid => asteroid.active);
    }
}