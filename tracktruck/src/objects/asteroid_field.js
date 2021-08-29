import Asteroid from "./asteroid";
import Marble from "./marble";

export default class AsteroidField {
    constructor(scene){
        this.scene = scene;
        this.asteroidsLayer = this.scene.add.layer();
        this.asteroids = [];
        this.marbles = [];
    }

    generate () {
        this.generationIntervalId = setInterval(() => this.add(), 1000)
    }

    stop () {
        clearInterval(this.generationIntervalId);
        this.asteroids.forEach(asteroid => {
            asteroid.destroy();
        });
    }

    add () {
        const added = new Asteroid(this.scene);
        this.asteroids.push(added);
        this.asteroids.forEach(asteroid => {
            this.scene.physics.add.collider(asteroid, added, added.asteroidHit, null, added);
        })
        this.maybeAddMarble();
    }

    addDispersed (dispersed) {
        this.asteroids.push(dispersed);
        this.asteroids.forEach(asteroid => {
            this.scene.physics.add.collider(asteroid, dispersed, dispersed.asteroidHit, null, dispersed);
        });
    }

    maybeAddMarble () {
        if (Phaser.Math.Between(1, 11) > 10) {
            const marble = new Marble(this.scene);
            this.marbles.push(marble);
        }
    }

    update () {
       this.asteroids.forEach( asteroid => {
           if (asteroid.x < -800) asteroid.destroy();
            if (asteroid.active) {
                asteroid.angle += 1/(5*asteroid.scale);
                asteroid.body.angle += 1/(5*asteroid.scale);
            }
       })
       this.asteroids = this.asteroids.filter(asteroid => asteroid.active);
       this.marbles.forEach( marble => {
        if (marble.x < -800) marble.destroy();
         if (marble.active) {
            marble.angle += 1/(5*marble.scale);
            marble.body.angle += 1/(5*marble.scale);
         }
    })
    this.marbles = this.marbles.filter(marble => marble.active);
    }
}