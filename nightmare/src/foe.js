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
    constructor (health = 2, damage = 1, name = "grunt") {
        this.health = health;
        this.damage = damage;
        this.name = name;
        this.ammo = new Ammo("gun", 10);
        this.sprite = name;
    }
}

export class Imp {
    constructor (health = 3, damage = 3, name = "imp") {
        this.health = health;
        this.damage = damage;
        this.name = name;
        this.ammo = null;
        this.sprite = name;
    }
}

export class ShotgunGuy {
    constructor (health = 3, damage = 2, name = "shotgun_guy") {
        this.health = health;
        this.damage = damage;
        this.name = name;
        this.ammo = new Ammo("gun", 10);
        this.sprite = name;
    }
}

export class MinigunGuy {
    constructor (health = 5, damage = 3, name = "minigun_guy") {
        this.health = health;
        this.damage = damage;
        this.name = name;
        this.ammo = new Ammo("gun", 10);
        this.sprite = name;
    }
}

export class Knight {
    constructor (health = 10, damage = 5, name = "knight") {
        this.health = health;
        this.damage = damage;
        this.name = name;
        this.ammo = null;
        this.sprite = name;
    }
}

export class Demon {
    constructor (health = 5, damage = 4, name = "demon") {
        this.health = health;
        this.damage = damage;
        this.name = name;
        this.ammo = null;
        this.sprite = name;
    }
}


export class Cacodemon {
    constructor (health = 10, damage = 5, name = "cacodemon") {
        this.health = health;
        this.damage = damage;
        this.name = name;
        this.ammo = null;
        this.sprite = name;
    }
}

export class Mancubus {
    constructor (health = 15, damage = 7, name = "mancubus") {
        this.health = health;
        this.damage = damage;
        this.name = name;
        this.ammo = null;
        this.sprite = name;
    }
}

export class Cyberdemon {
    constructor (health = 20, damage = 10, name = "cyberdemon") {
        this.health = health;
        this.damage = damage;
        this.name = name;
        this.ammo = null;
    }
}