import { Ammo } from "./tile";

class Foe {
    constructor (health, damage, ammo, name) {
        this.health = health;
        this.damage = damage;
        this.ammo = ammo;
        this.name = name;
    }

    shoot (range) {
        return this.damage;
    }
}

export class Grunt {
    constructor (health = 5, damage = 1, name = "grunt") {
        this.health = health;
        this.damage = damage;
        this.name = name;
        this.ammo = new Ammo("gun", 10);
    }
}