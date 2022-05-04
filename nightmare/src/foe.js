import { Ammo } from "./tile";

class Foe {
    constructor (health, damage, ammo, name) {
        this.health = health;
        this.damage = damage;
        this.ammo = ammo;
        this.name = name;
        this.sprite = name;
    }

    shoot (range) {
        return this.damage;
    }
}

export class Grunt {
    constructor (health = 4, damage = 2, name = "grunt") {
        this.health = health;
        this.damage = damage;
        this.name = name;
        this.ammo = new Ammo("gun", 10);
        this.sprite = name;
    }

    get info () {
        return " Damage: " + this.damage + " Health: " + this.health;
    }
}

export class Imp {
    constructor (health = 8, damage = 6, name = "imp") {
        this.health = health;
        this.damage = damage;
        this.name = name;
        this.ammo = null;
        this.sprite = name;
    }

    get info () {
        return " Damage: " + this.damage + " Health: " + this.health;
    }
}

export class ShotgunGuy {
    constructor (health = 8, damage = 6, name = "shotgun_guy") {
        this.health = health;
        this.damage = damage;
        this.name = name;
        this.ammo = new Ammo("gun", 10);
        this.sprite = name;
    }

    get info () {
        return " Damage: " + this.damage + " Health: " + this.health;
    }
}

export class MinigunGuy {
    constructor (health = 12, damage = 10, name = "minigun_guy") {
        this.health = health;
        this.damage = damage;
        this.name = name;
        this.ammo = new Ammo("gun", 10);
        this.sprite = name;
    }

    get info () {
        return " Damage: " + this.damage + " Health: " + this.health;
    }
}

export class Knight {
    constructor (health = 20, damage = 12, name = "knight") {
        this.health = health;
        this.damage = damage;
        this.name = name;
        this.ammo = null;
        this.sprite = name;
    }

    get info () {
        return " Damage: " + this.damage + " Health: " + this.health;
    }
}

export class Demon {
    constructor (health = 14, damage = 15, name = "demon") {
        this.health = health;
        this.damage = damage;
        this.name = name;
        this.ammo = null;
        this.sprite = name;
    }

    get info () {
        return " Damage: " + this.damage + " Health: " + this.health;
    }
}


export class Cacodemon {
    constructor (health = 20, damage = 18, name = "cacodemon") {
        this.health = health;
        this.damage = damage;
        this.name = name;
        this.ammo = null;
        this.sprite = name;
    }

    get info () {
        return " Damage: " + this.damage + " Health: " + this.health;
    }
}

export class Mancubus {
    constructor (health = 24, damage = 20, name = "mancubus") {
        this.health = health;
        this.damage = damage;
        this.name = name;
        this.ammo = null;
        this.sprite = name;
    }

    get info () {
        return " Damage: " + this.damage + " Health: " + this.health;
    }
}

export class Cyberdemon {
    constructor (health = 30, damage = 25, name = "cyberdemon") {
        this.health = health;
        this.damage = damage;
        this.name = name;
        this.ammo = null;
    }

    get info () {
        return " Damage: " + this.damage + " Health: " + this.health;
    }
}