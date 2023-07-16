import Shot from "./shot";

export default class ShootingPatterns {
    constructor (scene, name) {
        this.scene = scene;
        this.name = name;
        this.shootingMethods = {
            "water":  this.single.bind(this),
            "fruit":  this.tri.bind(this),
        };
    }

    shoot (x, y, powerUp) {
        this.shootingMethods[powerUp](x, y, powerUp);
    }

    single (x, y, powerUp) {
        this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name));
    }

    tri (x, y, powerUp) {
        this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name, -20));
        this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name));
        this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name, 20));
    }

    quintus (x, y, powerUp) {
        this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name, -40));
        this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name, -20));
        this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name));
        this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name, 20));
        this.scene.shots.add(new Shot(this.scene, x, y, powerUp, this.name, 40));
    }
}